/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";
import { handleEventImageUploads } from "@/lib/event-upload";
import { eventFormSchema } from "@/lib/validations/event";
import { ApiError, handleApiError } from "@/lib/error-handling";
import { extractPublicIdFromUrl } from "@/lib/image-service";
import { deleteImage } from "@/lib/cloudinary";
import mongoose from "mongoose";

// GET: Get single event// GET: Get single event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const event = (await Event.findById(params.id).lean()) as unknown as (IEvent & { _id: mongoose.Types.ObjectId });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Check access rights
    const isOrganizer = (session.user as { role?: string; id?: string })?.role === 'organizer';
    if (isOrganizer && event.organizerId.toString() !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_GET]", error);
    const apiError = handleApiError(error);
    return new NextResponse(apiError.message, { status: apiError.statusCode });
  }
}


// PATCH: Update event
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    // Find existing event
    const existingEvent = await Event.findById(params.id);
    if (!existingEvent) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Verify ownership
    if (existingEvent.organizerId.toString() !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    
    // Extract files
    const thumbnail = formData.get('thumbnail') as File | null;
    const layout = formData.get('layout') as File | null;

    // Handle image uploads if new files are provided
    if (thumbnail || layout) {
      const uploadResults = await handleEventImageUploads(
        thumbnail,
        layout,
        existingEvent.thumbnail,
        existingEvent.layout
      );

      if (uploadResults.thumbnailUrl) {
        formData.set('thumbnail', uploadResults.thumbnailUrl);
      }
      if (uploadResults.layoutUrl) {
        formData.set('layout', uploadResults.layoutUrl);
      }
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      { $set: Object.fromEntries(formData) },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    const apiError = handleApiError(error);
    return new NextResponse(apiError.message, { status: apiError.statusCode });
  }
}

// DELETE: Delete event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const event = await Event.findById(params.id);
    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Verify ownership
    if (event.organizerId.toString() !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete associated images from Cloudinary
    if (event.thumbnail) {
      const thumbnailId = extractPublicIdFromUrl(event.thumbnail);
      if (thumbnailId) await deleteImage(thumbnailId);
    }
    if (event.layout) {
      const layoutId = extractPublicIdFromUrl(event.layout);
      if (layoutId) await deleteImage(layoutId);
    }

    // Delete the event
    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    const apiError = handleApiError(error);
    return new NextResponse(apiError.message, { status: apiError.statusCode });
  }
}