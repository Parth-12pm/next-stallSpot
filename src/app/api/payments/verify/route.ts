import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Event from "@/models/Event";
import Razorpay from "razorpay";
import {
  sendPaymentConfirmationEmail,
  sendPaymentFailureNotification,
} from "@/lib/email";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface PaymentVerificationBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: PaymentVerificationBody = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const shasum = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET!
    );
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (!order.notes || !order.notes.applicationId) {
      throw new Error("Invalid order: missing application ID");
    }

    const application = await Application.findById(order.notes.applicationId)
      .populate("eventId", "title")
      .populate("vendorId", "name email");

    if (!application) {
      throw new Error("Application not found");
    }

    if (payment.status === "captured") {
      // Payment successful
      await Application.findByIdAndUpdate(order.notes.applicationId, {
        status: "payment_completed",
        paymentDetails: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: payment.amount / 100,
          paidAt: new Date(payment.created_at * 1000),
        },
      });

      console.log("Payment successful:", payment);

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
        }
      );

      // Send payment confirmation email
      const platformFee = (payment.amount / 100) * 0.05;
      await sendPaymentConfirmationEmail(
        application.vendorId.email,
        application.eventId.title,
        application.stallId.toString(),
        payment.amount / 100,
        razorpay_payment_id,
        platformFee
      );

      return NextResponse.json({
        success: true,
        message: "Payment successful",
        paymentId: razorpay_payment_id,
        redirectUrl: "/dashboard/applications",
      });
    } else {
      console.log("Payment failed:", payment);
      // Payment failed
      await Application.findByIdAndUpdate(order.notes.applicationId, {
        status: "payment_failed",
        paymentDetails: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: payment.amount / 100,
          failedAt: new Date(payment.created_at * 1000),
          failureReason: payment.error_description || "Payment failed",
        },
      });

      console.log("Payment failed:", payment);

      // Send payment failure notification
      await sendPaymentFailureNotification(
        application.vendorId.email,
        application.eventId.title,
        application.stallId.toString(),
        payment.error_description || "Payment failed"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment failed",
          paymentId: razorpay_payment_id,
          failureReason: payment.error_description || "Payment failed",
          redirectUrl: "/dashboard/applications",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to verify payment",
        redirectUrl: "/dashboard/applications",
      },
      { status: 500 }
    );
  }
}
