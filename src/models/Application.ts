import mongoose, { Schema, type Document } from "mongoose"
import type { IUser } from "@/models/User"
import type { IEvent } from "@/models/Event"

interface IProduct {
  productName: string
  productDetails: string
}

interface IFees {
  stallPrice: number
  platformFee: number
  entryFee: number
  gst: number
  totalAmount: number
}

interface IPaymentDetails {
  razorpayOrderId?: string
  razorpayPaymentId?: string
  amount?: number
  platformFee?: number
  organizerAmount?: number
  paidAt?: Date
  payoutId?: string
  payoutStatus?: string
  failedAt?: Date
  failureReason?: string
}

export interface IStatusHistory {
  status: string
  timestamp: Date
  updatedBy: mongoose.Types.ObjectId | IUser
  reason?: string
}

export interface IApplication extends Document {
  eventId: mongoose.Types.ObjectId | IEvent
  vendorId: mongoose.Types.ObjectId | IUser
  stallId: number
  status:
    | "pending"
    | "under_review"
    | "approved"
    | "rejected"
    | "payment_pending"
    | "payment_completed"
    | "cancelled"
    | "expired"
    | "payment_failed"
  products: IProduct[]
  applicationDate: Date
  approvalDate?: Date
  rejectionReason?: string
  paymentDeadline?: Date
  fees: IFees
  paymentDetails?: IPaymentDetails
  statusHistory: IStatusHistory[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      minlength: 2,
    },
    productDetails: {
      type: String,
      required: true,
      minlength: 10,
    },
  },
  { _id: false },
)

const FeesSchema = new Schema(
  {
    stallPrice: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    entryFee: { type: Number, required: true },
    gst: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { _id: false },
)

const PaymentDetailsSchema = new Schema(
  {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: Number,
    platformFee: Number,
    organizerAmount: Number,
    paidAt: Date,
    payoutId: String,
    payoutStatus: String,
    failedAt: Date,
    failureReason: String,
  },
  { _id: false },
)

const StatusHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: String,
  },
  { _id: false },
)

const ApplicationSchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stallId: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "payment_pending",
        "payment_completed",
        "cancelled",
        "expired",
      ],
      default: "pending",
    },
    products: {
      type: [ProductSchema],
      required: true,
      validate: [
        {
          validator: (products: IProduct[]) => products.length > 0,
          message: "At least one product is required",
        },
      ],
    },
    applicationDate: { type: Date, default: Date.now },
    approvalDate: Date,
    rejectionReason: String,
    paymentDeadline: Date,
    fees: FeesSchema,
    paymentDetails: PaymentDetailsSchema,
    statusHistory: [StatusHistorySchema],
  },
  {
    timestamps: true,
  },
)

// Index for preventing multiple active applications
ApplicationSchema.index(
  { eventId: 1, vendorId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "approved", "payment_pending"] },
    },
  },
)

// Auto-expire payment_pending applications after 24 hours
ApplicationSchema.index({ paymentDeadline: 1 }, { expireAfterSeconds: 0 })

// Add a new pre-save hook to update status history
ApplicationSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.vendorId, // Assuming the vendor is making the change
    })
  }
  next()
})

const Application = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)

export default Application

