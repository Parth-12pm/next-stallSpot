// app/api/exhibitions/[id]/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
  const session = await getServerSession();

  try {
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Validate exhibition ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid exhibition ID format" }, 
        { status: 400 }
      );
    }

    // Connect to database
    connection = await dbConnect();

    // Start a session for transaction
    const sess = await connection.startSession();

    try {
      return await sess.withTransaction(async () => {
        // Get event and validate with population
        const event = await Event.findById(id)
          .populate('organizerId', 'email')
          .session(sess)
          .exec();

        if (!event) {
          throw new Error("Exhibition not found");
        }

        if (event.status !== 'published') {
          throw new Error("Exhibition is not accepting applications");
        }

        // Parse request body
        const body = await request.json() as ApplicationBody;
        const { stallId, products, fees } = body;

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

        // Create application
        const application = await Application.create([{
          eventId: event._id,
          vendorId: session.user.id,
          stallId,
          products,
          status: 'pending',
          applicationDate: new Date(),
          fees,
        }], { session: sess });

        // Update stall status to reserved
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

        // Get organizer's email from populated event
        const organizerEmail = (event.organizerId as IUser).email;

        // Send notification to organizer
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
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}