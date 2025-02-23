import mongoose, { Schema, type Document } from "mongoose"
import type { IUser } from "./User"

export interface IStall {
  stallId: number
  displayId: string
  type: "standard" | "premium" | "corner"
  category: string
  name: string
  price: string
  size: string
  status: "available" | "reserved" | "blocked" | "booked"
}

export interface IStatusHistory {
  status: string
  timestamp: Date
  updatedBy: mongoose.Types.ObjectId | IUser | "system"
  updatedByModel: "User" | "system"
  reason?: string
}

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  venue: string
  numberOfStalls: number
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  entryFee?: string
  facilities: string[]
  category: string
  layout?: string
  thumbnail?: string
  organizerId: mongoose.Types.ObjectId | IUser
  status: "draft" | "pending_review" | "approved" | "published" | "ongoing" | "completed" | "cancelled"
  stallConfiguration: IStall[]
  configurationComplete: boolean
  statusHistory: IStatusHistory[]
  createdAt: Date
  updatedAt: Date
  updateStatus(): string
}

const StallSchema = new Schema({
  stallId: { type: Number, required: true },
  displayId: { type: String, required: true },
  type: {
    type: String,
    enum: ["standard", "premium", "corner"],
    default: "standard",
    required: true,
  },
  category: { type: String, required: true },
  name: { type: String, default: "" },
  price: { type: String, required: true },
  size: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "reserved", "blocked", "booked"],
    default: "available",
    required: true,
  },
})

const StatusHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: {
      type: Schema.Types.Mixed,
      required: true,
      refPath: "statusHistory.updatedByModel",
    },
    updatedByModel: {
      type: String,
      required: true,
      enum: ["User", "system"],
    },
    reason: String,
  },
  { _id: false },
)

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    numberOfStalls: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    entryFee: { type: String },
    facilities: [{ type: String }],
    category: { type: String, required: true },
    layout: { type: String },
    thumbnail: { type: String },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending_review", "approved", "published", "ongoing", "completed", "cancelled"],
      default: "draft",
    },
    stallConfiguration: {
      type: [StallSchema],
      default: [],
    },
    configurationComplete: {
      type: Boolean,
      default: false,
    },
    statusHistory: [StatusHistorySchema],
  },
  {
    timestamps: true,
  },
)

EventSchema.methods.updateStatus = function (this: IEvent) {
  const now = new Date()
  const startDate = new Date(this.startDate)
  const endDate = new Date(this.endDate)

  let newStatus = this.status

  if (now < startDate) {
    if (this.status === "published") {
      newStatus = "published"
    } else if (this.status !== "draft" && this.status !== "pending_review") {
      newStatus = "approved"
    }
  } else if (now >= startDate && now <= endDate) {
    newStatus = "ongoing"
  } else if (now > endDate) {
    newStatus = "completed"
  }

  if (newStatus !== this.status) {
    this.status = newStatus
    this.statusHistory.push({
      status: newStatus,
      timestamp: now,
      updatedBy: "system",
      updatedByModel: "system",
      reason: "Automatic status update",
    })
  }

  return this.status
}

// Helper function to normalize dates for comparison
const normalizeDate = (date: Date) => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

// Validate dates on save
EventSchema.pre("save", function (next) {
  // Compare normalized dates
  const today = normalizeDate(new Date())
  const startDate = normalizeDate(this.startDate)
  const endDate = normalizeDate(this.endDate)

  if (endDate <= startDate) {
    return next(new Error("End date must be after start date"))
  }

  if (startDate < today) {
    return next(new Error("Start date must be today or in the future"))
  }

  next()
})

// Validate dates on update
EventSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as { startDate?: Date; endDate?: Date }
  if (!update || (!update.startDate && !update.endDate)) {
    return next()
  }

  const doc = await this.model.findOne(this.getQuery())
  const startDate = normalizeDate(update.startDate || doc.startDate)
  const endDate = normalizeDate(update.endDate || doc.endDate)
  const today = normalizeDate(new Date())

  if (endDate <= startDate) {
    return next(new Error("End date must be after start date"))
  }

  if (startDate < today) {
    return next(new Error("Start date must be today or in the future"))
  }

  next()
})

// Validate stall configuration
EventSchema.pre("save", function (next) {
  if (this.stallConfiguration.length > this.numberOfStalls) {
    return next(new Error("Stall configuration exceeds the number of stalls"))
  }
  next()
})

// Add a new pre-save hook to update status history
EventSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.organizerId,
      updatedByModel: "User",
    })
  }
  next()
})

// Export model
const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event

