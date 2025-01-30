/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/exhibitions/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    await dbConnect();

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user has access
    const isOrganizer = (session?.user as any)?.role === 'organizer';
    
    // If not organizer, only show published events
    if (!isOrganizer && event.status !== 'published') {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // If organizer, check if they own the event
    if (isOrganizer && event.organizerId.toString() !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}