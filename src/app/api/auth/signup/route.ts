// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { handleServerError } from "@/lib/server-error-handling"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email?.trim()) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    if (!password?.trim()) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 })
    }

    if (!name?.trim()) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    if (!role || !["organizer", "vendor"].includes(role)) {
      return NextResponse.json({ message: "Invalid role specified" }, { status: 400 })
    }

    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json(
      {
        user: userResponse,
        message: "Registration successful",
      },
      { status: 201 },
    )
  } catch (error) {
    const apiError = handleServerError(error)
    return NextResponse.json({ message: apiError.message }, { status: apiError.statusCode })
  }
}

