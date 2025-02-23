import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import { handleEventImageUploads } from "@/lib/event-upload"
import { extractPublicIdFromUrl } from "@/lib/image-service"
import { deleteImage } from "@/lib/cloudinary"
import mongoose from "mongoose"
import { handleApiError, unauthorizedError, notFoundError } from "@/lib/api-error-handling"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return unauthorizedError()
    }

    await dbConnect()

    const { id } = await context.params

    const event = await Event.findById(id)

    if (!event) {
      return notFoundError("Event")
    }

    const isOrganizer = (session.user as { role?: string; id?: string })?.role === "organizer"
    if (isOrganizer && event.organizerId.toString() !== session.user.id) {
      return unauthorizedError()
    }

    // Update the event status before returning
    event.updateStatus()
    await event.save()

    return NextResponse.json(event)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as { role?: string })?.role !== "organizer") {
      return unauthorizedError()
    }

    await dbConnect()

    const { id } = await context.params
    const existingEvent = await Event.findById(id)

    if (!existingEvent) {
      return notFoundError("Event")
    }

    if (existingEvent.organizerId.toString() !== session.user.id) {
      return unauthorizedError()
    }

    const formData = await request.formData()

    const thumbnail = formData.get("thumbnail") as File | null
    const layout = formData.get("layout") as File | null

    if (thumbnail || layout) {
      const uploadResults = await handleEventImageUploads(
        thumbnail,
        layout,
        existingEvent.thumbnail,
        existingEvent.layout,
      )

      if (uploadResults.thumbnailUrl) {
        formData.set("thumbnail", uploadResults.thumbnailUrl)
      }
      if (uploadResults.layoutUrl) {
        formData.set("layout", uploadResults.layoutUrl)
      }
    }

    const newStatus = formData.get("status") as string
    if (newStatus && newStatus !== existingEvent.status) {
      // Validate status transition
      if (!isValidStatusTransition(existingEvent.status, newStatus)) {
        return NextResponse.json({ error: "Invalid status transition" }, { status: 400 })
      }

      // Add status history entry
      existingEvent.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        updatedBy: new mongoose.Types.ObjectId(session.user.id),
        reason: (formData.get("statusChangeReason") as string) || undefined,
      })
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: Object.fromEntries(formData) },
      { new: true, runValidators: true },
    )

    if (updatedEvent) {
      // Update the event status after updating
      updatedEvent.updateStatus()
      await updatedEvent.save()
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as { role?: string })?.role !== "organizer") {
      return unauthorizedError()
    }

    await dbConnect()

    const { id } = await context.params
    const event = await Event.findById(id)

    if (!event) {
      return notFoundError("Event")
    }

    if (event.organizerId.toString() !== session.user.id) {
      return unauthorizedError()
    }

    if (event.thumbnail) {
      const thumbnailId = extractPublicIdFromUrl(event.thumbnail)
      if (thumbnailId) await deleteImage(thumbnailId)
    }
    if (event.layout) {
      const layoutId = extractPublicIdFromUrl(event.layout)
      if (layoutId) await deleteImage(layoutId)
    }

    await Event.findByIdAndDelete(id)

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    return handleApiError(error)
  }
}

function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  const validTransitions: { [key: string]: string[] } = {
    draft: ["pending_review", "cancelled"],
    pending_review: ["approved", "rejected", "cancelled"],
    approved: ["published", "cancelled"],
    ongoing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}

