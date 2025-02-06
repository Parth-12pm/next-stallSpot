/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/exhibitions/[id]/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";  // Add this import
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Event from "@/models/Event";
import type { IUser } from "@/models/User";
import { sendApplicationNotification } from "@/lib/email";
import type { IStall } from "@/models/Event";
import { isValidObjectId } from 'mongoose';

interface ApplicationBody {
  stallId: number;
  products: Array<{
    productName: string;
    productDetails: string;
  }>;
  fees: {
    stallPrice: number;
    platformFee: number;
    entryFee: number;
    gst: number;
    totalAmount: number;
  };
}

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let connection;
  
  try {
    // Get session with authOptions
    const session = await getServerSession(authOptions);
    
    // Enhanced session validation
    if (!session?.user?.id) {
      console.error("Session or user ID missing:", session);
      return NextResponse.json(
        { error: "Unauthorized - Valid session required" }, 
        { status: 401 }
      );
    }

    // Log the session data
    console.log("Session data:", {
      userId: session.user.id,
      role: session.user.role
    });

    // Connect to database
    connection = await dbConnect();

    // Parse request body early to validate
    const body = await request.json();
    console.log("Request body:", body);

    // Start a session for transaction
    const sess = await connection.startSession();

    try {
      return await sess.withTransaction(async () => {
        // Get event and validate
        const event = await Event.findById(id)
          .populate('organizerId', 'email')
          .session(sess)
          .exec();

        if (!event) {
          throw new Error("Exhibition not found");
        }

        // Validate event status
        if (event.status !== 'published') {
          throw new Error("Exhibition is not accepting applications");
        }

        const { stallId, products, fees } = body;

        // Validate required fields
        if (!stallId || !products || !fees) {
          throw new Error("Missing required fields");
        }

        // Verify stall exists and is available
        const stall = event.stallConfiguration.find(
          (s: IStall) => s.stallId === stallId
        );

        if (!stall) {
          throw new Error("Stall not found");
        }

        if (stall.status !== 'available') {
          throw new Error("Stall is not available");
        }

        // Check for existing applications
        const existingApplication = await Application.findOne({
          eventId: event._id,
          vendorId: session.user.id,
          status: { $in: ['pending', 'approved', 'payment_pending'] }
        }).session(sess);

        if (existingApplication) {
          throw new Error("You already have an active application for this exhibition");
        }

        // Create application with explicit session user ID
        console.log("Creating application with vendor ID:", session.user.id);
        
        const application = await Application.create([{
          eventId: event._id,
          vendorId: session.user.id,
          stallId,
          products,
          status: 'pending',
          applicationDate: new Date(),
          fees,
        }], { session: sess });

        // Update stall status
        await Event.updateOne(
          { 
            _id: event._id, 
            "stallConfiguration.stallId": stallId 
          },
          { 
            $set: { "stallConfiguration.$.status": "reserved" } 
          },
          { session: sess }
        );

        // Get organizer's email and send notification
        const organizerEmail = (event.organizerId as IUser).email;
        if (organizerEmail) {
          await sendApplicationNotification(
            organizerEmail,
            event.title,
            stall.displayId,
            application[0]._id.toString()
          );
        }

        return NextResponse.json({
          message: "Application submitted successfully",
          applicationId: application[0]._id
        });
      });
    } catch (error) {
      console.error("Transaction Error:", error);
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      throw error;
    } finally {
      await sess.endSession();
    }
  } catch (error) {
    console.error("[APPLICATION_SUBMIT]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit application" },
      { status: 500 }
    );
  }
}