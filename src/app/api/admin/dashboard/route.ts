import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Event from "@/models/Event"
import Application from "@/models/Application"
import Contact from "@/models/Contact"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const [totalUsers, totalEvents, totalApplications, totalContacts, totalPayments] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Application.countDocuments(),
      Contact.countDocuments(),
      Application.aggregate([
        { $match: { status: "payment_completed" } },
        { $group: { _id: null, total: { $sum: "$fees.totalAmount" } } },
      ]),
    ])

    return NextResponse.json({
      totalUsers,
      totalEvents,
      totalApplications,
      totalContacts,
      totalPayments: totalPayments[0]?.total || 0,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

