import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean()

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

