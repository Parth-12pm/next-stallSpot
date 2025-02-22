import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { handleServerError } from "@/lib/server-error-handling"
import { authOptions } from "../auth/[...nextauth]/auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email }).select("-password")
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    const apiError = handleServerError(error)
    return NextResponse.json(
      {
        message: apiError.message,
        errors: apiError.errors,
      },
      { status: apiError.statusCode },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update only allowed fields
    const allowedFields = ["name", "contact", "address", "profilePicture"]
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        user[field] = data[field]
      }
    })

    await user.save()

    return NextResponse.json({ message: "Profile updated successfully", user })
  } catch (error) {
    const apiError = handleServerError(error)
    return NextResponse.json(
      {
        message: apiError.message,
        errors: apiError.errors,
      },
      { status: apiError.statusCode },
    )
  }
}

