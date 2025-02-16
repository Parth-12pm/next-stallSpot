// src/models/User.ts
import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  password?: string
  name: string
  role: "organizer" | "vendor"
  profileComplete: boolean
  dateOfBirth?: Date
  googleId?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  contact?: string
  address?: string
  companyDetails?: {
    companyName?: string | null
    registrationType?: "CIN" | "GSTIN" | "UDYAM" | null
    registrationNumber?: string | null
    website?: string | null
  } | null
  accountDetails?: {
    bankName?: string
    accountNumber?: string
    ifscCode?: string
    razorpayFundAccountId?: string
  }
  selfDescription?: string
  profilePicture?: string
}

type CompanyDetails = NonNullable<IUser["companyDetails"]>

const CompanyDetailsSchema = new Schema(
  {
    companyName: String,
    registrationType: {
      type: String,
      enum: ["CIN", "GSTIN", "UDYAM"],
    },
    registrationNumber: String,
    website: String,
  },
  { _id: false },
)

const AccountDetailsSchema = new Schema(
  {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    razorpayFundAccountId: String,
  },
  { _id: false },
)

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    role: { type: String, enum: ["organizer", "vendor"], required: true },
    profileComplete: { type: Boolean, default: false },
    dateOfBirth: { type: Date },
    googleId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    contact: String,
    address: String,
    companyDetails: CompanyDetailsSchema,
    accountDetails: AccountDetailsSchema,
    selfDescription: String,
    profilePicture: String,
  },
  {
    timestamps: true,
  },
)

function hasCompleteCompanyDetails(details: CompanyDetails | null | undefined): boolean {
  return !!(details && details.companyName && details.registrationType && details.registrationNumber)
}

// Password validation
UserSchema.pre("save", function (next) {
  if (this.isNew && !this.googleId && !this.password) {
    next(new Error("Password is required for email signup"))
  }
  next()
})

// Profile completion validation
UserSchema.pre("save", async function (next) {
  if (!this.isModified("profileComplete") || !this.profileComplete) {
    return next()
  }

  const errors: string[] = []

  if (!this.contact) errors.push("Contact is required")
  if (!this.address) errors.push("Address is required")
  if (!this.dateOfBirth) errors.push("Date of birth is required")
  if (!this.selfDescription) errors.push("Self description is required")

  if (!this.accountDetails?.bankName) errors.push("Bank name is required")
  if (!this.accountDetails?.accountNumber) errors.push("Account number is required")
  if (!this.accountDetails?.ifscCode) errors.push("IFSC code is required")

  if (this.role === "organizer") {
    if (!hasCompleteCompanyDetails(this.companyDetails)) {
      errors.push("Complete company details are required for organizers")
    }
  }

  if (errors.length > 0) {
    next(new Error(errors.join(", ")))
  } else {
    next()
  }
})

UserSchema.pre("save", function (next) {
  // Only validate company details if user is a vendor AND companyDetails exists
  if (this.role === "vendor" && this.companyDetails) {
    const { companyName, registrationNumber, registrationType } = this.companyDetails
    if (!(companyName && registrationNumber && registrationType)) {
      return next(new Error("If providing company details, all fields must be completed"))
    }
  }

  next()
})

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User

