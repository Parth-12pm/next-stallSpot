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
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false,
        error: "Not authenticated" 
      }, { status: 401 });
    }

    if (session.user.role !== 'organizer') {
      return NextResponse.json({ 
        success: false,
        error: "Unauthorized - Organizer access only" 
      }, { status: 403 });
    }

    await dbConnect();

    const organizerEvents = await Event.find({ 
      organizerId: session.user.id 
    }).select('_id title venue startDate');

    const eventIds = organizerEvents.map(event => event._id);

    const applications = await Application.find({
      eventId: { $in: eventIds }
    })
    .populate('eventId', 'title venue startDate')
    .populate('vendorId', 'name email contact')
    .sort({ applicationDate: -1 })
    .lean();

    return NextResponse.json({
      success: true,
      applications,
      total: applications.length
    });

  } catch (error) {
    console.error("[FETCH_APPLICATIONS]", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch applications",
      applications: []
    }, { status: 500 });
  }
}