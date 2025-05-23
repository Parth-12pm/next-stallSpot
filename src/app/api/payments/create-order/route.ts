import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import type { IUser } from "@/models/User";
import type { IEvent } from "@/models/Event";



export async function POST(request: Request) {
  try {

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay credentials in environment variables");
    }
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await request.json();

    await dbConnect();

    const application = await Application.findById(applicationId)
      .populate<{ eventId: IEvent }>("eventId", "title organizerId")
      .populate<{ vendorId: IUser }>("vendorId", "name email");

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "payment_pending") {
      return NextResponse.json(
        { error: "Invalid application status" },
        { status: 400 }
      );
    }

    const { totalAmount } = application.fees;
    console.log("razorpay key id:", process.env.RAZORPAY_KEY_ID);
    console.log("razorpay key secret:", process.env.RAZORPAY_KEY_SECRET);

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: applicationId,
      notes: {
        applicationId: applicationId,
        eventId: application.eventId._id.toString(),
        vendorId: application.vendorId._id.toString(),
        organizerId: application.eventId.organizerId.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: totalAmount,
      currency: order.currency,
      vendorName: application.vendorId.name,
      vendorEmail: application.vendorId.email,
      eventTitle: application.eventId.title,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
