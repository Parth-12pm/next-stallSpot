// File: src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"
import crypto from "crypto"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"
import { handleServerError } from "@/lib/server-error-handling"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    await dbConnect()

    const user = await User.findOne({ email })
    if (!user) {
      // We don't want to reveal whether a user exists or not
      return NextResponse.json({ message: "If an account exists, a reset email will be sent." }, { status: 200 })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour from now
    await user.save()

    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({ message: "If an account exists, a reset email will be sent." }, { status: 200 })
  } catch (error) {
    const apiError = handleServerError(error)
    return NextResponse.json({ message: apiError.message }, { status: apiError.statusCode })
  }
}

