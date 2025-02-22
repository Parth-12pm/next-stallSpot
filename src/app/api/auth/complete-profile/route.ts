import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User, { type IUser } from "@/models/User"
import { handleImageChange } from "@/lib/image-service"
import { handleServerError } from "@/lib/server-error-handling"
import { authOptions } from "../[...nextauth]/auth-options"
import { z } from "zod"

type CompanyDetails = NonNullable<IUser["companyDetails"]>

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  dateOfBirth: z.string().refine((dob) => {
    const age = (new Date().getTime() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return age >= 18
  }, "You must be at least 18 years old"),
  contact: z.string().min(10, "Contact number must be at least 10 characters long"),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  companyDetails: z
    .object({
      companyName: z.string().optional(),
      registrationType: z.enum(["CIN", "GSTIN", "UDYAM"]).optional(),
      registrationNumber: z.string().optional(),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  accountDetails: z.object({
    bankName: z.string().min(2, "Bank name is required"),
    accountNumber: z.string().min(8, "Account number must be at least 8 characters long"),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  }),
  selfDescription: z.string().min(10, "Self description must be at least 10 characters long"),
  profilePicture: z.string().optional(),
})

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

    // Validate input data
    const validationResult = profileSchema.safeParse(data)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    const validatedData = validationResult.data

    // Handle profile picture change
    if (validatedData.profilePicture && validatedData.profilePicture !== user.profilePicture) {
      validatedData.profilePicture = await handleImageChange(validatedData.profilePicture, user.profilePicture)
    }

    // Handle company details for vendors
    if (user.role === "vendor" && !validatedData.companyDetails?.companyName) {
      validatedData.companyDetails = undefined
    }

    // Update user data
    Object.assign(user, validatedData)

    user.profileComplete = true
    await user.save()

    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        profileComplete: true,
      },
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profileComplete: true,
      session: updatedSession,
    })
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

