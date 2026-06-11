import nodemailer, { SentMessageInfo } from "nodemailer";
import DOMPurify from "isomorphic-dompurify";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Only bypass SSL verification in development
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<SentMessageInfo> {
  try {
    const info = await transporter.sendMail({
      from: '"StallSpot" <[EMAIL_ADDRESS]>',
      to,
      subject,
      html: DOMPurify.sanitize(html),
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
