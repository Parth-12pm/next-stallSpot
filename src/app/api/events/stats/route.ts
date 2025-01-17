// app/api/events/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import dbConnect from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";
import { handleServerError } from "@/lib/server-error-handling";

export async function GET() {  // Removed unused 'request' parameter
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // Get event counts by status
    const activeEvents = await Event.countDocuments({ 
      organizerId: userId,
      status: 'published',
      endDate: { $gte: new Date() }
    });

    const draftEvents = await Event.countDocuments({ 
      organizerId: userId,
      status: 'draft' 
    });

    const completedEvents = await Event.countDocuments({ 
      organizerId: userId,
      status: 'completed' 
    });

    // Get total stalls across all events
    const events = await Event.find({ organizerId: userId }) as IEvent[];
    const totalStalls = events.reduce((sum, event) => sum + event.numberOfStalls, 0);
    
    // Fixed the implicit any type for stall
    const bookedStalls = events.reduce((sum, event) => {
      const booked = event.stallConfiguration?.filter(
        (stall: { status: string }) => stall.status === 'booked'
      ).length || 0;
      return sum + booked;
    }, 0);

    return NextResponse.json({
      activeEvents,
      draftEvents,
      completedEvents,
      totalStalls,
      bookedStalls,
      recentEvents: events
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
    });
  } catch (error) {
    console.error("[EVENTS_STATS_GET]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}