// src/app/api/vendor/payments/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import "@/models/User"
import "@/models/Event"
import Application from "@/models/Application"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // For now, we'll use the applications data to simulate payments
    // In a real application, you would have a separate payments collection
    const applications = await Application.find({
      vendorId: session.user.id,
      status: "payment_completed",
    })
      .populate("eventId", "title")
      .sort({ applicationDate: -1 })

    const payments = applications.map((app) => ({
      _id: app._id,
      eventId: app.eventId,
      applicationId: app._id,
      amount: app.fees.totalAmount,
      status: "completed",
      paymentDate: app.applicationDate,
      paymentMethod: "credit_card",
      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    }))

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching vendor payments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

