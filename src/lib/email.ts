// File: src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${resetToken}`;
  
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Default sender email from Resend
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

