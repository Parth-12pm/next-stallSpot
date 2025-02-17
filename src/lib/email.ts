// src/lib/email.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    })
    if (result.error) {
      throw new Error(`Failed to send reset email: ${result.error.message}`)
    }
    console.log(`Password reset email sent successfully to ${email}`)
  } catch (error) {
    console.error("Failed to send reset email:", error)
    throw new Error("Failed to send reset email")
  }
}

export async function sendApplicationNotification(
  to: string,
  eventTitle: string,
  stallId: string,
  applicationId: string,
) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/applications`

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `New Application for ${eventTitle}`,
      html: `
        <h1>New Stall Application</h1>
        <p>A new application has been received for stall ${stallId} in ${eventTitle}.</p>
        <p>Please review the application [${applicationId}] in your dashboard:</p>
        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">View Application</a>
      `,
    })
    if (result.error) {
      throw new Error(`Failed to send application notification: ${result.error.message}`)
    }
    console.log(`Application notification email sent successfully to ${to}`)
  } catch (error) {
    console.error("Failed to send application notification:", error)
    // Don't throw error to prevent blocking the application process
  }
}

export async function sendApplicationStatusUpdate(
  to: string,
  eventTitle: string,
  stallId: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
  paymentLink?: string,
) {
  try {
    const subject =
      status === "approved" ? `Application Approved - ${eventTitle}` : `Application Status Update - ${eventTitle}`

    const html =
      status === "approved"
        ? `
        <h1>Your Application is Approved!</h1>
        <p>Your application for stall ${stallId} in ${eventTitle} has been approved.</p>
        <p>Please complete the payment within 24 hours to secure your booking:</p>
        <a href="${paymentLink}" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Complete Payment</a>
        <p>Note: The booking will automatically expire if payment is not received within 24 hours.</p>
        <p>Additional charges:</p>
        <ul>
          <li>Platform fee: 5% of the total amount</li>
        </ul>
      `
        : `
        <h1>Application Status Update</h1>
        <p>Your application for stall ${stallId} in ${eventTitle} has been reviewed.</p>
        <p>Status: Rejected</p>
        ${rejectionReason ? `<p>Reason: ${rejectionReason}</p>` : ""}
        <p>You can apply for other available stalls in our exhibitions.</p>
      `

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    })

    if (result.error) {
      throw new Error(`Failed to send status update email: ${result.error.message}`)
    }

    console.log(`Status update email sent successfully to ${to}`)
  } catch (error) {
    console.error("Failed to send status update email:", error)
    throw new Error("Failed to send status update email")
  }
}

export async function sendPaymentConfirmationEmail(
  to: string,
  eventTitle: string,
  stallId: string,
  amount: number,
  paymentId: string,
  platformFee: number,
) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `Payment Confirmation - ${eventTitle}`,
      html: `
        <h1>Payment Confirmation</h1>
        <p>Thank you for your payment for stall ${stallId} in ${eventTitle}.</p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
          <h2>Payment Details</h2>
          <p>Payment ID: ${paymentId}</p>
          <p>Base Amount: ₹${(amount - platformFee).toLocaleString()}</p>
          <p>Platform Fee (5%): ₹${platformFee.toLocaleString()}</p>
          <p>Total Amount Paid: ₹${amount.toLocaleString()}</p>
        </div>
        <p>Your stall booking is now confirmed. You can view the details in your dashboard.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
      `,
    })

    if (result.error) {
      throw new Error(`Failed to send payment confirmation email: ${result.error.message}`)
    }

    console.log(`Payment confirmation email sent successfully to ${to}`)
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error)
    throw new Error("Failed to send payment confirmation email")
  }
}

export async function sendOrganizerPaymentNotification(
  to: string,
  eventTitle: string,
  stallId: string,
  vendorName: string,
  amount: number,
  platformFee: number,
  payoutId: string,
) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `Payment Received - ${eventTitle}`,
      html: `
        <h1>Payment Received</h1>
        <p>A payment has been received for stall ${stallId} in ${eventTitle}.</p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
          <h2>Payment Details</h2>
          <p>Vendor: ${vendorName}</p>
          <p>Total Amount: ₹${amount.toLocaleString()}</p>
          <p>Platform Fee (5%): ₹${platformFee.toLocaleString()}</p>
          <p>Your Payout Amount: ₹${(amount - platformFee).toLocaleString()}</p>
          <p>Payout ID: ${payoutId}</p>
        </div>
        <p>The payment has been processed and your share will be transferred to your registered bank account.</p>
        <p>You can view the complete transaction details in your dashboard:</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/payments" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">View Payment Details</a>
      `,
    })
    if (result.error) {
      throw new Error(`Failed to send organizer payment notification: ${result.error.message}`)
    }
    console.log(`Organizer payment notification email sent successfully to ${to}`)
  } catch (error) {
    console.error("Failed to send organizer payment notification:", error)
  }
}

export async function sendPaymentFailureNotification(to: string, eventTitle: string, stallId: string, error: string) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `Payment Failed - ${eventTitle}`,
      html: `
        <h1>Payment Failed</h1>
        <p>We encountered an issue processing your payment for stall ${stallId} in ${eventTitle}.</p>
        <p>Error: ${error}</p>
        <p>Please try again or contact support if the issue persists.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/applications" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Try Again</a>
      `,
    })
    if (result.error) {
      throw new Error(`Failed to send payment failure notification: ${result.error.message}`)
    }
    console.log(`Payment failure notification email sent successfully to ${to}`)
  } catch (error) {
    console.error("Failed to send payment failure notification:", error)
  }
}

