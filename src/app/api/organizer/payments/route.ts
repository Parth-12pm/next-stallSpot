// This route handles fetching payments for organizers
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Application from "@/models/Application"
import { handleServerError } from "@/lib/server-error-handling"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as { role?: string })?.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get all events for the organizer
    const events = await Event.find({ organizerId: session.user.id }).select("_id title")

    // Get all completed payments for the organizer's events
    const payments = await Application.aggregate([
      {
        $match: {
          eventId: { $in: events.map((event) => event._id) },
          status: "payment_completed",
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          eventId: 1,
          eventTitle: "$event.title",
          vendorId: 1,
          stallId: 1,
          amount: "$fees.totalAmount",
          platformFee: "$fees.platformFee",
          organizerAmount: { $subtract: ["$fees.totalAmount", "$fees.platformFee"] },
          paymentDate: "$paymentDetails.paidAt",
          transactionId: "$paymentDetails.razorpayPaymentId",
        },
      },
      {
        $sort: { paymentDate: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])

    const total = await Application.countDocuments({
      eventId: { $in: events.map((event) => event._id) },
      status: "payment_completed",
    })

    // Calculate total earnings
    const totalEarnings = await Application.aggregate([
      {
        $match: {
          eventId: { $in: events.map((event) => event._id) },
          status: "payment_completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$fees.totalAmount" },
          platformFees: { $sum: "$fees.platformFee" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          platformFees: 1,
          organizerEarnings: { $subtract: ["$total", "$platformFees"] },
        },
      },
    ])

    return NextResponse.json({
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
      earnings: totalEarnings[0] || { total: 0, platformFees: 0, organizerEarnings: 0 },
    })
  } catch (error) {
    console.error("Error fetching organizer payments:", error)
    const apiError = handleServerError(error)
    return NextResponse.json({ error: apiError.message, errors: apiError.errors }, { status: apiError.statusCode })
  }
}

