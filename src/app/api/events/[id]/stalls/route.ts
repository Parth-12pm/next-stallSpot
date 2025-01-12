/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/events/[id]/stalls/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// GET: Get stalls for an event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const eventId = params.id;
    
    // TODO: Add database query to get stalls
    // If organizer: Get all stalls with detailed info
    // If vendor: Get available stalls with basic info
    
    return NextResponse.json({ message: "Stalls list" });
  } catch (error) {
    console.error("[STALLS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST: Update stall configurations
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an organizer
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const eventId = params.id;
    const stallConfigs = await request.json();
    
    // TODO:
    // 1. Verify user owns this event
    // 2. Validate stall configurations
    // 3. Update stall data
    
    return NextResponse.json({ message: "Stalls updated successfully" });
  } catch (error) {
    console.error("[STALLS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH: Update single stall
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an organizer
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const eventId = params.id;
    const { stallId, ...stallData } = await request.json();
    
    // TODO:
    // 1. Verify user owns this event
    // 2. Validate stall data
    // 3. Update specific stall
    
    return NextResponse.json({ message: "Stall updated successfully" });
  } catch (error) {
    console.error("[STALL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}