// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { handleEventImageUploads } from "@/lib/event-upload";
import { eventFormSchema } from "@/lib/validations/event";
import { handleServerError } from "@/lib/server-error-handling";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const isOrganizer = (session.user as { role?: string })?.role === 'organizer';
    
    // Build query based on user role
    const query = isOrganizer 
      ? { organizerId: session.user.id }  // Organizers see their own events
      : { 
          status: 'published',  // Others only see published events
          configurationComplete: true  // and fully configured events
        };

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }
    
    if ((session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json(
        { error: "Unauthorized - Not an organizer" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const formData = await request.formData();
    
    const thumbnail = formData.get('thumbnail') as File | null;
    const layout = formData.get('layout') as File | null;
    
    const eventData = {
      title: formData.get('eventName'),
      description: formData.get('description'),
      venue: formData.get('venue'),
      numberOfStalls: Number(formData.get('numberOfStalls')),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      entryFee: formData.get('entryFee') || undefined,
      facilities: formData.getAll('facilities'),
      category: formData.get('category'),
    };

    // Validate event data
    const validatedData = eventFormSchema.parse(eventData);

    // Handle image uploads
    const uploadResults = await handleEventImageUploads(thumbnail, layout);

    // Create event in draft status
    const event = await Event.create({
      ...validatedData,
      organizerId: session.user.id,
      thumbnail: uploadResults.thumbnailUrl,
      layout: uploadResults.layoutUrl,
      status: 'draft',
      configurationComplete: false,
      stallConfiguration: [] // Initialize empty stall configuration
    });

    return NextResponse.json({
      success: true,
      event,
      message: "Event created successfully",
      redirectUrl: `/dashboard/events/${event._id}/stalls`
    });

  } catch (error) {
    console.error("[EVENTS_POST]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { 
        success: false,
        error: apiError.message, 
        errors: apiError.errors 
      },
      { status: apiError.statusCode }
    );
  }
}