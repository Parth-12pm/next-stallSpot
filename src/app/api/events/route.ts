import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import Event, { type IEvent } from "@/models/Event"
import { handleEventImageUploads } from "@/lib/event-upload"
import { handleServerError } from "@/lib/server-error-handling"
import { rateLimit } from "@/lib/rate-limit"
import { sanitizeInput } from "@/lib/sanitize-input"
import { cache } from "@/lib/cache"
import { z } from "zod"

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

// Helper function for consistent response format
const apiResponse = (success: boolean, data: any, message?: string, statusCode = 200) => {
  return NextResponse.json({ success, data, message }, { status: statusCode })
}

const updateEventStatus = async (event: IEvent) => {
  const updatedStatus = event.updateStatus()
  if (updatedStatus !== event.status) {
    await event.save()
  }
  return event
}

const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  venue: z.string().min(3, { message: "Venue must be at least 3 characters." }),
  numberOfStalls: z.number().min(1, { message: "Must have at least 1 stall." }),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  entryFee: z.string().optional(),
  facilities: z.array(z.string()),
  category: z.string(),
})

export async function GET(request: Request) {
  try {
    await limiter.check(request, 10, "CACHE_TOKEN") // Max 10 requests per minute per IP

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return apiResponse(false, null, "Unauthorized", 401)
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const isOrganizer = (session.user as { role?: string })?.role === "organizer"

    const query = isOrganizer
      ? { organizerId: session.user.id }
      : {
          status: { $in: ["published", "ongoing", "completed"] },
          configurationComplete: true,
        }

    const cacheKey = `events_${isOrganizer ? session.user.id : "public"}_${page}_${limit}`
    const cachedData = await cache.get(cacheKey)

    if (cachedData) {
      return apiResponse(true, JSON.parse(cachedData))
    }

    let events = await Event.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Update status for each event
    events = await Promise.all(
      events.map(async (event) => {
        const updatedEvent = event.updateStatus()
        if (updatedEvent !== event.status) {
          await event.save()
        }
        return event
      }),
    )

    const total = await Event.countDocuments(query)

    const responseData = {
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    }

    await cache.set(cacheKey, JSON.stringify(responseData),{ttl: 60}) // Cache for 1 minute

    return apiResponse(true, responseData)
  } catch (error) {
    console.error("[EVENTS_GET]", error)
    const apiError = handleServerError(error)
    return apiResponse(false, null, apiError.message, apiError.statusCode)
  }
}

export async function POST(request: Request) {
  try {
    await limiter.check(request, 5, "CACHE_TOKEN") // Max 5 POST requests per minute per IP

    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return apiResponse(false, null, "Unauthorized - No session", 401)
    }

    if ((session.user as { role?: string })?.role !== "organizer") {
      return apiResponse(false, null, "Unauthorized - Not an organizer", 401)
    }

    await dbConnect()

    const formData = await request.formData()

    const thumbnail = formData.get("thumbnail") as File | null
    const layout = formData.get("layout") as File | null

    const eventData = {
      title: sanitizeInput(formData.get("eventName") as string),
      description: sanitizeInput(formData.get("description") as string),
      venue: sanitizeInput(formData.get("venue") as string),
      numberOfStalls: Number(formData.get("numberOfStalls")),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      entryFee: formData.get("entryFee") || undefined,
      facilities: formData.getAll("facilities").map((f) => sanitizeInput(f as string)),
      category: sanitizeInput(formData.get("category") as string),
    }

    const validatedData = eventFormSchema.parse(eventData)

    const uploadResults = await handleEventImageUploads(thumbnail, layout)

    const event = await Event.create({
      ...validatedData,
      organizerId: session.user.id,
      thumbnail: uploadResults.thumbnailUrl,
      layout: uploadResults.layoutUrl,
      status: "draft",
      configurationComplete: false,
      stallConfiguration: [],
      statusHistory: [{ status: "draft", timestamp: new Date(), updatedBy: session.user.id, updatedByModel: "User" }],
    })

    return apiResponse(true, { event }, "Event created successfully")
  } catch (error) {
    console.error("[EVENTS_POST]", error)
    const apiError = handleServerError(error)
    return apiResponse(false, null, apiError.message, apiError.statusCode)
  }
}

