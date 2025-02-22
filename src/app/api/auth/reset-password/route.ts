import { NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { handleServerError } from "@/lib/server-error-handling"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    await dbConnect()

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 })
  } catch (error) {
    const apiError = handleServerError(error)
    return NextResponse.json({ message: apiError.message }, { status: apiError.statusCode })
  }
}

