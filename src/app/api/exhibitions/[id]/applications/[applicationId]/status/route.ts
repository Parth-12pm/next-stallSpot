// app/api/exhibitions/[id]/applications/[applicationId]/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import { type NextRequest } from 'next/server';  // Add this import
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
req: NextRequest,
  { params }: { params: { id: string, applicationId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get event and validate ownership
    const event = await Event.findOne({
      _id: params.id,
      organizerId: session.user.id
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body: StatusUpdateBody = await req.json();
    const { status, rejectionReason } = body;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get application and validate
    const application = await Application.findById(params.applicationId)
      .populate<{ vendorId: PopulatedVendor }>('vendorId', 'email');

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== 'pending') {
      return NextResponse.json({ error: "Application is not in pending state" }, { status: 400 });
    }

    if (application.eventId.toString() !== params.id) {
      return NextResponse.json({ error: "Application does not match event" }, { status: 400 });
    }

    // For approvals, check if stall is still available
    if (status === 'approved') {
      const stall = event.stallConfiguration.find((s: IStall) => s.stallId === application.stallId);
      if (!stall || stall.status !== 'reserved') {
        return NextResponse.json({ error: "Stall is no longer available" }, { status: 400 });
      }
    }

    // Update application
    const updates = {
      status: status === 'approved' ? 'payment_pending' : 'rejected',
      rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      approvalDate: status === 'approved' ? new Date() : undefined,
      paymentDeadline: status === 'approved' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
    };

    const updatedApplication = await Application.findByIdAndUpdate(
      params.applicationId,
      { $set: updates },
      { new: true }
    );

    // Update stall status if rejected
    if (status === 'rejected') {
      await Event.updateOne(
        { _id: params.id, "stallConfiguration.stallId": application.stallId },
        { $set: { "stallConfiguration.$.status": "available" } }
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

    return NextResponse.json({
      message: `Application ${status} successfully`,
      application: updatedApplication
    });

  } catch (error) {
    console.error("[APPLICATION_STATUS_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}