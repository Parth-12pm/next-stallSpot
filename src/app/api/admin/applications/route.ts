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

    const applications = await Application.find()
      .populate("eventId", "title")
      .populate("vendorId", "name")
      .sort({ applicationDate: -1 })
      .lean()

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching admin applications:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

