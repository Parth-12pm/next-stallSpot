// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
  
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send reset email:', error);
    throw new Error('Failed to send reset email');
  }
}

export async function sendApplicationNotification(
  to: string,
  eventTitle: string,
  stallId: string,
  applicationId: string
) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/applications`;
  
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: `New Application for ${eventTitle}`,
      html: `
        <h1>New Stall Application</h1>
        <p>A new application has been received for stall ${stallId} in ${eventTitle}.</p>
        <p>Please review the application [${applicationId}] in your dashboard:</p>
        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">View Application</a>
      `
    });
  } catch (error) {
    console.error('Failed to send application notification:', error);
    // Don't throw error to prevent blocking the application process
  }
}

export async function sendApplicationStatusUpdate(
  to: string,
  eventTitle: string,
  stallId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string,
  paymentLink?: string
) {
  try {
    const subject = status === 'approved' 
      ? `Application Approved - ${eventTitle}`
      : `Application Status Update - ${eventTitle}`;

    const html = status === 'approved'
      ? `
        <h1>Your Application is Approved!</h1>
        <p>Your application for stall ${stallId} in ${eventTitle} has been approved.</p>
        <p>Please complete the payment within 24 hours to secure your booking:</p>
        <a href="${paymentLink}" style="display: inline-block; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Complete Payment</a>
        <p>Note: The booking will automatically expire if payment is not received within 24 hours.</p>
      `
      : `
        <h1>Application Status Update</h1>
        <p>Your application for stall ${stallId} in ${eventTitle} has been reviewed.</p>
        <p>Status: Rejected</p>
        ${rejectionReason ? `<p>Reason: ${rejectionReason}</p>` : ''}
        <p>You can apply for other available stalls in our exhibitions.</p>
      `;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
}