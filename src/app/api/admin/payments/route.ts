// This route handles fetching all payments for admin users
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import Application from "@/models/Application"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as { role?: string })?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const payments = await Application.find({ status: "payment_completed" })
      .populate("eventId", "title")
      .populate("vendorId", "name")
      .sort({ "paymentDetails.paidAt": -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,
      eventId: { title: payment.eventId.title },
      vendorId: { name: payment.vendorId.name },
      amount: payment.fees.totalAmount,
      status: payment.status,
      paymentDate: payment.paymentDetails?.paidAt || payment.updatedAt,
      transactionId: payment.paymentDetails?.razorpayPaymentId || "N/A",
    }))

    const total = await Application.countDocuments({ status: "payment_completed" })

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
    console.error("Error fetching admin payments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

