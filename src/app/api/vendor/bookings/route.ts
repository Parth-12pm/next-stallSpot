// src/app/api/vendor/bookings/route.ts
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

    const bookings = await Application.find({
      vendorId: session.user.id,
      status: "payment_completed",
    })
      .populate("eventId", "title venue startDate endDate")
      .sort({ applicationDate: -1 })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching vendor bookings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

