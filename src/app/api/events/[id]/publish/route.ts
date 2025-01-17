// app/api/events/[id]/publish/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/auth-options";
import { handleServerError } from "@/lib/server-error-handling";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json(
        { error: "Unauthorized - Only organizers can publish events" }, 
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await context.params;
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" }, 
        { status: 404 }
      );
    }

    if (event.organizerId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this event" }, 
        { status: 401 }
      );
    }

    // Validate event is ready for publishing
    if (!event.configurationComplete) {
      return NextResponse.json(
        { error: "Cannot publish: Stall configuration is incomplete" }, 
        { status: 400 }
      );
    }

    if (!event.stallConfiguration || event.stallConfiguration.length === 0) {
      return NextResponse.json(
        { error: "Cannot publish: No stalls configured" }, 
        { status: 400 }
      );
    }

    // Additional validations
    if (!event.thumbnail) {
      return NextResponse.json(
        { error: "Cannot publish: Event thumbnail is required" }, 
        { status: 400 }
      );
    }

    if (new Date(event.startDate) <= new Date()) {
      return NextResponse.json(
        { error: "Cannot publish: Event start date must be in the future" }, 
        { status: 400 }
      );
    }

    // Update event status to published
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status: 'published',
          publishedAt: new Date()
        } 
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Event published successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("[EVENT_PUBLISH]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}