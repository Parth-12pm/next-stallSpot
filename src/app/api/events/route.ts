/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { handleEventImageUploads } from "@/lib/event-upload";
import { eventFormSchema } from "@/lib/validations/event";
import { ApiError, handleApiError } from "@/lib/error-handling";

// GET: List events
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      : { status: 'published' };          // Vendors see all published events

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
    const apiError = handleApiError(error);
    return new NextResponse(apiError.message, { status: apiError.statusCode });
  }
}

// POST: Create new event
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an organizer
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    
    const formData = await request.formData();
    
    // Extract file data
    const thumbnail = formData.get('thumbnail') as File | null;
    const layout = formData.get('layout') as File | null;
    
    // Convert FormData to object for validation
    const eventData = {
      title: formData.get('eventName'),
      description: formData.get('description'),
      venue: formData.get('venue'),
      numberOfStalls: Number(formData.get('numberOfStalls')),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      bookingFee: formData.get('bookingFee'),
      entryFee: formData.get('entryFee') || undefined,
      facilities: formData.getAll('facilities'),
      category: formData.get('category'),
    };

    // Validate event data
    const validatedData = eventFormSchema.parse(eventData);

    // Handle image uploads
    const uploadResults = await handleEventImageUploads(thumbnail, layout);

    // Create event
    const event = await Event.create({
      ...validatedData,
      organizerId: session.user.id,
      thumbnail: uploadResults.thumbnailUrl,
      layout: uploadResults.layoutUrl,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    const apiError = handleApiError(error);
    return new NextResponse(apiError.message, { status: apiError.statusCode });
  }
}