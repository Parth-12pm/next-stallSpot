// app/api/exhibitions/[id]/applications/[applicationId]/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";  // Added import for authOptions
import dbConnect from "@/lib/mongodb";
import { type NextRequest } from 'next/server';
import Application from "@/models/Application";
import Event from "@/models/Event";
import type { IStall } from "@/models/Event";
import { sendApplicationStatusUpdate } from "@/lib/email";

interface StatusUpdateBody {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

interface PopulatedVendor {
  email: string;
  name: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; applicationId: string } }
): Promise<NextResponse> {
  let connection;
  
  try {
    // Get session using authOptions
    const session = await getServerSession(authOptions);
    
    // Debug log session
    console.log("Session in status update:", {
      session,
      userId: session?.user?.id,
      role: session?.user?.role
    });

    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check authorization
    if (session.user.role !== 'organizer') {
      return NextResponse.json(
        { error: "Access denied - Organizer role required" }, 
        { status: 403 }
      );
    }

    // Connect to database
    connection = await dbConnect();

    const { id: eventId, applicationId } = params;

    // Validate request body
    const body: StatusUpdateBody = await request.json();
    const { status, rejectionReason } = body;

    // Debug log request data
    console.log("Processing status update:", {
      eventId,
      applicationId,
      status,
      userId: session.user.id
    });

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Use Promise.all for parallel queries
    const [event, application] = await Promise.all([
      Event.findOne({
        _id: eventId,
        organizerId: session.user.id
      }).exec(),
      Application.findById(applicationId)
        .populate<{ vendorId: PopulatedVendor }>('vendorId', 'email name')
        .exec()
    ]);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== 'pending') {
      return NextResponse.json({ error: "Application is not in pending state" }, { status: 400 });
    }

    if (application.eventId.toString() !== eventId) {
      return NextResponse.json({ error: "Application does not match event" }, { status: 400 });
    }

    // Start a session for transaction
    const sess = await connection.startSession();
    
    try {
      await sess.withTransaction(async () => {
        // For approvals, check if stall is still available
        if (status === 'approved') {
          const stall = event.stallConfiguration.find((s: IStall) => s.stallId === application.stallId);
          if (!stall || stall.status !== 'reserved') {
            throw new Error("Stall is no longer available");
          }
        }

        if (status === 'approved') {
          await Event.updateOne(
            { 
              _id: eventId, 
              "stallConfiguration.stallId": application.stallId 
            },
            { 
              $set: { "stallConfiguration.$.status": "reserved" } 
            },
            { session: sess }
          );
        }

        // Update application
        const updates = {
          status: status === 'approved' ? 'payment_pending' : 'rejected',
          rejectionReason: status === 'rejected' ? rejectionReason : undefined,
          approvalDate: status === 'approved' ? new Date() : undefined,
          paymentDeadline: status === 'approved' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
        };

        const updatedApplication = await Application.findByIdAndUpdate(
          applicationId,
          { $set: updates },
          { new: true, session: sess }
        );

        // Update stall status if rejected
        if (status === 'rejected') {
          await Event.updateOne(
            { _id: eventId, "stallConfiguration.stallId": application.stallId },
            { $set: { "stallConfiguration.$.status": "available" } },
            { session: sess }
          );
        }

        // Send email notification
        await sendApplicationStatusUpdate(
          application.vendorId.email,
          event.title,
          application.stallId.toString(),
          status,
          rejectionReason,
          status === 'approved' ? `${process.env.NEXTAUTH_URL}/dashboard/applications/${application._id}/payment` : undefined
        );

        return updatedApplication;
      });

      return NextResponse.json({
        message: `Application ${status} successfully`,
        application: application
      });

    } catch (error) {
      throw error;
    } finally {
      await sess.endSession();
    }

  } catch (error) {
    console.error("[APPLICATION_STATUS_UPDATE]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update application status" },
      { status: 500 }
    );
  }
}