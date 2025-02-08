// app/api/vendor/applications/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import Application from "@/models/Application"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const applications = await Application.find({
      vendorId: session.user.id,
    })
      .populate({
        path: "eventId",
        select: "title venue startDate endDate"
      })
      .sort({ applicationDate: -1 })
      .lean()

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching vendor applications:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications" }, 
      { status: 500 }
    )
  }
}