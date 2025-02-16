import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import Application from "@/models/Application"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const payments = await Application.find({ status: "payment_completed" })
      .populate("eventId", "title")
      .populate("vendorId", "name")
      .sort({ "paymentDetails.paidAt": -1 })
      .lean()

    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,
      eventId: { title: payment.eventId.title },
      vendorId: { name: payment.vendorId.name },
      amount: payment.fees.totalAmount,
      status: payment.status,
      createdAt: payment.paymentDetails?.paidAt || payment.updatedAt,
    }))

    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error("Error fetching admin payments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

