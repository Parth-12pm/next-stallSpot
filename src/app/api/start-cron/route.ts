import { NextResponse } from "next/server";
import "@/jobs/updateEventStatuses"; // Importing it will automatically start cron

export async function GET() {
  return NextResponse.json({ message: "Cron job running in the background" });
}
