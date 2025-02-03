/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/exhibitions/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";
import { isValidObjectId } from 'mongoose';
import type { Session } from "next-auth";

interface UserWithRole extends Session {
  user: {
    id?: string;
    role?: 'organizer' | 'vendor';
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid exhibition ID format" }, 
        { status: 400 }
      );
    }

    const session = await getServerSession() as UserWithRole;
    await dbConnect();

    // Explicitly type the event response and use exec()
    const event = await Event.findById(params.id).lean().exec() as IEvent | null;
    
    if (!event) {
      return NextResponse.json(
        { error: "Exhibition not found" }, 
        { status: 404 }
      );
    }

    // Check if user has access
    const isOrganizer = session?.user?.role === 'organizer';
    
    // If not organizer, only show published events
    if (!isOrganizer && event.status !== 'published') {
      return NextResponse.json(
        { error: "Exhibition not found" }, 
        { status: 404 }
      );
    }

    // If organizer, check if they own the event
    if (isOrganizer && event.organizerId.toString() !== session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized to access this exhibition" }, 
        { status: 401 }
      );
    }

    // Remove sensitive information if needed
    if (!isOrganizer) {
      // Use type omit to properly type the filtered data
      const { organizerId, ...publicEventData } = event;
      return NextResponse.json(publicEventData);
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EXHIBITION_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch exhibition details" },
      { status: 500 }
    );
  }
}