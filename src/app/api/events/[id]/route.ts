/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import dbConnect from "@/lib/mongodb";
import Event, { IEvent } from "@/models/Event";
import { handleEventImageUploads } from "@/lib/event-upload";
import { eventFormSchema } from "@/lib/validations/event";
import { handleServerError } from "@/lib/server-error-handling";
import { extractPublicIdFromUrl } from "@/lib/image-service";
import { deleteImage } from "@/lib/cloudinary";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;
  
    const event = (await Event.findById(id).lean()) as unknown as (IEvent & { _id: mongoose.Types.ObjectId });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const isOrganizer = (session.user as { role?: string; id?: string })?.role === 'organizer';
    if (isOrganizer && event.organizerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_GET]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;
    const existingEvent = await Event.findById(id);    

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (existingEvent.organizerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    const thumbnail = formData.get('thumbnail') as File | null;
    const layout = formData.get('layout') as File | null;

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

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: Object.fromEntries(formData) },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.organizerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (event.thumbnail) {
      const thumbnailId = extractPublicIdFromUrl(event.thumbnail);
      if (thumbnailId) await deleteImage(thumbnailId);
    }
    if (event.layout) {
      const layoutId = extractPublicIdFromUrl(event.layout);
      if (layoutId) await deleteImage(layoutId);
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}