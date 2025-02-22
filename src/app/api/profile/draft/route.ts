import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { handleServerError } from "@/lib/server-error-handling"
import { authOptions } from "../../auth/[...nextauth]/auth-options"
import { z } from "zod"

const draftSchema = z.object({
  contact: z.string().optional(),
  address: z.string().optional(),
  companyDetails: z
    .object({
      companyName: z.string().optional(),
      registrationType: z.enum(["CIN", "GSTIN", "UDYAM"]).optional(),
      registrationNumber: z.string().optional(),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  accountDetails: z
    .object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      ifscCode: z.string().optional(),
    })
    .optional(),
  selfDescription: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

export async function POST(req: Request) {
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
    const validationResult = draftSchema.safeParse(data)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    const validatedData = validationResult.data

    // Update only the fields that are present in the draft
    Object.keys(validatedData).forEach((field) => {
      const key = field as keyof typeof validatedData;
      if (validatedData[key] !== undefined) {
        user[key] = validatedData[key]
      }
    })

    // Don't mark profile as complete for drafts
    await user.save()

    return NextResponse.json({ message: "Draft saved successfully" })
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findOne({ email: session.user.email }).select(
      "contact address companyDetails accountDetails selfDescription dateOfBirth",
    )

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

