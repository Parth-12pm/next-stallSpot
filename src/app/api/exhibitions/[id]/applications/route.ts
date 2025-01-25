// app/api/exhibitions/[id]/applications/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Event from "@/models/Event";
import type { IUser } from "@/models/User";
import { sendApplicationNotification } from "@/lib/email";
import type { IStall } from "@/models/Event"; // Assuming you have this type in Event model

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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get event and validate
    const event = await Event.findById(params.id).populate('organizerId', 'email');
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== 'published') {
      return NextResponse.json({ error: "Event is not accepting applications" }, { status: 400 });
    }

    const body: ApplicationBody = await request.json();
    const { stallId, products, fees } = body;

    // Verify stall exists and is available
    const stall = event.stallConfiguration.find((stall: IStall) => stall.stallId === stallId);
    if (!stall) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }

    if (stall.status !== 'available') {
      return NextResponse.json({ error: "Stall is not available" }, { status: 400 });
    }

    // Check if vendor already has a pending/approved application for this event
    const existingApplication = await Application.findOne({
      eventId: event._id,
      vendorId: session.user.id,
      status: { $in: ['pending', 'approved', 'payment_pending'] }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You already have an active application for this event" },
        { status: 400 }
      );
    }

    // Create application
    const application = await Application.create({
      eventId: event._id,
      vendorId: session.user.id,
      stallId,
      products,
      status: 'pending',
      applicationDate: new Date(),
      fees,
    });

    // Update stall status to reserved
    await Event.updateOne(
      { _id: event._id, "stallConfiguration.stallId": stallId },
      { $set: { "stallConfiguration.$.status": "reserved" } }
    );

    // Get organizer's email from populated event
    const organizerEmail = (event.organizerId as IUser).email;

    // Send notification to organizer
    if (organizerEmail) {
      await sendApplicationNotification(
        organizerEmail,
        event.title,
        stall.displayId,
        application._id.toString()
      );
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      applicationId: application._id
    });

  } catch (error) {
    console.error("[APPLICATION_SUBMIT]", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}