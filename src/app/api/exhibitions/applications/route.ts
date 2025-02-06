// app/api/exhibitions/applications/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Event from "@/models/Event";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Log session info for debugging
    console.log("Session data:", {
      userId: session?.user?.id,
      role: session?.user?.role,
      authenticated: !!session
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== 'organizer') {
      return NextResponse.json({ error: "Unauthorized - Organizer access only" }, { status: 403 });
    }

    await dbConnect();

    // First get all events by this organizer
    const organizerEvents = await Event.find({ 
      organizerId: session.user.id 
    }).select('_id title venue startDate');

    const eventIds = organizerEvents.map(event => event._id);

    // Then get all applications for these events
    const applications = await Application.find({
      eventId: { $in: eventIds }
    })
    .populate('eventId', 'title venue startDate')
    .populate('vendorId', 'name email contact')
    .sort({ applicationDate: -1 })
    .lean();

    console.log(`Found ${applications.length} applications for organizer ${session.user.id}`);

    return NextResponse.json(applications);

  } catch (error) {
    console.error("[FETCH_APPLICATIONS]", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}