// This route handles fetching payments for vendors
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import Application from "@/models/Application"
import { handleServerError } from "@/lib/server-error-handling"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as { role?: string })?.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const payments = await Application.find({
      vendorId: session.user.id,
      status: "payment_completed",
    })
      .populate("eventId", "title")
      .sort({ "paymentDetails.paidAt": -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,
      eventId: payment.eventId,
      applicationId: payment._id,
      amount: payment.fees.totalAmount,
      status: "completed",
      paymentDate: payment.paymentDetails?.paidAt || payment.updatedAt,
      paymentMethod: "Razorpay",
      transactionId: payment.paymentDetails?.razorpayPaymentId || "N/A",
    }))

    const total = await Application.countDocuments({
      vendorId: session.user.id,
      status: "payment_completed",
    })

    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching vendor payments:", error)
    const apiError = handleServerError(error)
    return NextResponse.json({ error: apiError.message, errors: apiError.errors }, { status: apiError.statusCode })
  }
}

