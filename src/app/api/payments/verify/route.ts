import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import crypto from "crypto"
import dbConnect from "@/lib/mongodb"
import Application from "@/models/Application"
import Event from "@/models/Event"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

interface RazorpayOrder {
  id: string
  amount: string | number
  currency: string
  receipt?: string
  notes?: {
    applicationId?: string
    eventId?: string
    vendorId?: string
    organizerId?: string
    vendorAmount?: string
    organizerAmount?: string
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = shasum.digest("hex")

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    await dbConnect()

    // Fetch the order details from Razorpay
    const order: RazorpayOrder = await razorpay.orders.fetch(razorpay_order_id)

    if (!order.notes || !order.notes.applicationId) {
      throw new Error("Invalid order: missing application ID")
    }

    const amountInRupees = typeof order.amount === "string" ? Number.parseFloat(order.amount) / 100 : order.amount / 100

    // Update application status
    const application = await Application.findByIdAndUpdate(
      order.notes?.applicationId,
      {
        status: "payment_completed",
        paymentDetails: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: amountInRupees,
          paidAt: new Date(),
        },
      },
      { new: true },
    )

    if (!application) {
      throw new Error("Application not found")
    }

    if (!order.notes.eventId || !order.notes.vendorId) {
      throw new Error("Invalid order: missing event ID or vendor ID")
    }

    // Update stall status in the event
    await Event.updateOne(
      {
        _id: order.notes.eventId,
        "stallConfiguration.stallId": application.stallId,
      },
      {
        $set: {
          "stallConfiguration.$.status": "booked",
          "stallConfiguration.$.bookedBy": order.notes.vendorId,
        },
      },
    )

    // TODO: Implement logic to transfer funds to the organizer (minus platform fee)
    // This would typically involve creating a payout to the organizer's account
    // You may need to use Razorpay's payout API or your own custom logic

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}

