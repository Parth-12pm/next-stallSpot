// src/models/Event.ts
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

export interface IEvent extends Document {
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
  status: "draft" | "published" | "completed" | "cancelled"
  stallConfiguration: IStall[]
  configurationComplete: boolean
  createdAt: Date
  updatedAt: Date
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
      enum: ["draft", "published", "completed", "cancelled"],
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
  },
  {
    timestamps: true,
  },
)

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

// Export model
const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event

