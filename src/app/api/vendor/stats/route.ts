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

    // Get all applications for the vendor
    const applications = await Application.find({
      vendorId: session.user.id,
    }).populate("eventId")

    // Calculate statistics
    const activeBookings = applications.filter(
      (app) => app.status === "payment_completed" && new Date(app.eventId.endDate) >= new Date(),
    ).length

    const pendingApplications = applications.filter((app) => ["pending", "payment_pending"].includes(app.status)).length

    const totalSpent = applications
      .filter((app) => app.status === "payment_completed")
      .reduce((sum, app) => sum + app.fees.totalAmount, 0)

    const successfulApplications = applications.filter((app) => app.status === "payment_completed").length
    const totalApplications = applications.length
    const successRate = totalApplications > 0 ? Math.round((successfulApplications / totalApplications) * 100) : 0

    // Get recent applications
    const recentApplications = await Application.find({
      vendorId: session.user.id,
    })
      .sort({ applicationDate: -1 })
      .limit(3)
      .populate("eventId", "title")

    return NextResponse.json({
      activeBookings,
      pendingApplications,
      totalSpent,
      successRate,
      recentApplications,
    })
  } catch (error) {
    console.error("Error fetching vendor stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

