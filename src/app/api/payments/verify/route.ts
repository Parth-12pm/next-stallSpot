import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import crypto from "crypto"
import dbConnect from "@/lib/mongodb"
import Application from "@/models/Application"
import Event from "@/models/Event"
import User from "@/models/User"
import Razorpay from "razorpay"
import {
  sendPaymentConfirmationEmail,
  sendOrganizerPaymentNotification,
  sendPaymentFailureNotification,
} from "@/lib/email"

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
    totalAmount?: string
    platformFee?: string
    organizerAmount?: string
  }
}

interface PaymentVerificationBody {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: PaymentVerificationBody = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

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

    const totalAmount = Number(order.notes.totalAmount)
    const platformFee = Number(order.notes.platformFee)
    const organizerAmount = Number(order.notes.organizerAmount)

    // Update application status
    const application = await Application.findByIdAndUpdate(
      order.notes.applicationId,
      {
        status: "payment_completed",
        paymentDetails: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: totalAmount,
          platformFee,
          organizerAmount,
          paidAt: new Date(),
        },
      },
      { new: true },
    )
      .populate("eventId", "title organizerId")
      .populate("vendorId", "name email")

    if (!application) {
      throw new Error("Application not found")
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

    try {
      // Fetch organizer details
      const organizer = await User.findById(order.notes.organizerId)
      if (!organizer || !organizer.accountDetails?.razorpayFundAccountId) {
        throw new Error("Organizer account details not found")
      }

      // Create payout to organizer
      const payout = await razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
        fund_account_id: organizer.accountDetails.razorpayFundAccountId,
        amount: organizerAmount * 100, // Convert to paise
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `payout_${application._id}`,
        narration: `Payout for event ${application.eventId.title}`,
      })

      // Update application with payout details
      await Application.findByIdAndUpdate(application._id, {
        $set: {
          "paymentDetails.payoutId": payout.id,
          "paymentDetails.payoutStatus": payout.status,
        },
      })

      // Send payment confirmation emails
      await Promise.all([
        sendPaymentConfirmationEmail(
          application.vendorId.email,
          application.eventId.title,
          application.stallId.toString(),
          totalAmount,
          razorpay_payment_id,
          platformFee,
        ),
        sendOrganizerPaymentNotification(
          organizer.email,
          application.eventId.title,
          application.stallId.toString(),
          application.vendorId.name,
          totalAmount,
          platformFee,
          payout.id,
        ),
      ])

      return NextResponse.json({
        success: true,
        payoutId: payout.id,
      })
    } catch (payoutError) {
      console.error("Payout error:", payoutError)

      // Send payment failure notification
      await sendPaymentFailureNotification(
        application.vendorId.email,
        application.eventId.title,
        application.stallId.toString(),
        payoutError instanceof Error ? payoutError.message : "Failed to process payout",
      )

      throw payoutError
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to verify payment",
      },
      { status: 500 },
    )
  }
}

