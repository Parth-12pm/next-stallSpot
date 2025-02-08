import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import type { NextRequest } from "next/server"
import Application from "@/models/Application"
import Event from "@/models/Event"
import { sendApplicationStatusUpdate } from "@/lib/email"

interface StatusUpdateBody {
  status: "approved" | "rejected"
  rejectionReason?: string
}

interface PopulatedVendor {
  email: string
  name: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; applicationId: string }> },
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    const { id: eventId, applicationId } = await params // Await the params

    if (!session?.user?.id || session.user.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Debug log IDs
    console.log("Processing status update:", { eventId, applicationId })

    await dbConnect()

    // Debug log request data
    console.log("Processing status update:", {
      eventId,
      applicationId,
      userId: session.user.id,
    })

    // Validate request body
    const body: StatusUpdateBody = await request.json()
    const { status, rejectionReason } = body

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Use Promise.all for parallel queries
    const [event, application] = await Promise.all([
      Event.findOne({
        _id: eventId,
        organizerId: session.user.id,
      }).exec(),
      Application.findById(applicationId).populate<{ vendorId: PopulatedVendor }>("vendorId", "email name").exec(),
    ])

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    if (application.status !== "pending") {
      return NextResponse.json({ error: "Application is not in pending state" }, { status: 400 })
    }

    if (application.eventId.toString() !== eventId) {
      return NextResponse.json({ error: "Application does not match event" }, { status: 400 })
    }

    // Start a session for transaction
    const sess = await (await dbConnect()).startSession()

    try {
      await sess.withTransaction(async () => {
        // For approvals, check if stall is still available
        if (status === "approved") {
          // First, verify stall exists and check its current status
          const event = await Event.findOne(
            {
              _id: eventId,
              "stallConfiguration.stallId": application.stallId,
            },
            { "stallConfiguration.$": 1 },
          ).session(sess)

          const stall = event?.stallConfiguration[0]
          if (!stall || stall.status !== "reserved") {
            throw new Error("Stall is no longer available")
          }

          // Update stall status to reserved
          await Event.updateOne(
            {
              _id: eventId,
              "stallConfiguration.stallId": application.stallId,
            },
            {
              $set: {
                "stallConfiguration.$.status": "reserved",
                "stallConfiguration.$.lastUpdated": new Date(),
              },
            },
            { session: sess },
          )
        }

        // Update application with more detailed status tracking
        const updates = {
          status: status === "approved" ? "payment_pending" : "rejected",
          rejectionReason: status === "rejected" ? rejectionReason : undefined,
          approvalDate: status === "approved" ? new Date() : undefined,
          paymentDeadline: status === "approved" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
          statusHistory: {
            status: status === "approved" ? "payment_pending" : "rejected",
            updatedAt: new Date(),
            updatedBy: session.user.id,
          },
        }

        const updatedApplication = await Application.findByIdAndUpdate(
          applicationId,
          {
            $set: updates,
            $push: { statusHistory: updates.statusHistory },
          },
          { new: true, session: sess },
        )

        // If rejected, update stall status back to available
        if (status === "rejected") {
          await Event.updateOne(
            {
              _id: eventId,
              "stallConfiguration.stallId": application.stallId,
            },
            {
              $set: {
                "stallConfiguration.$.status": "available",
                "stallConfiguration.$.lastUpdated": new Date(),
              },
            },
            { session: sess },
          )
        }

        // Send email notification
        await sendApplicationStatusUpdate(
          application.vendorId.email,
          event.title,
          application.stallId.toString(),
          status,
          rejectionReason,
          status === "approved"
            ? `${process.env.NEXTAUTH_URL}/dashboard/applications/${application._id}/payment`
            : undefined,
        )

        // Return both updated application and stall status
        return {
          application: updatedApplication,
          stallStatus: status === "approved" ? "reserved" : "available",
        }
      })

      // Update the response to include stall status
      return NextResponse.json({
        message: `Application ${status} successfully`,
        application: application,
        stallStatus: status === "approved" ? "reserved" : "available",
      })
    } catch (error) {
      throw error
    } finally {
      await sess.endSession()
    }
  } catch (error) {
    console.error("[APPLICATION_STATUS_UPDATE]", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update application status",
      },
      { status: 500 },
    )
  }
}

