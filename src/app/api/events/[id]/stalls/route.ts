// app/api/events/[id]/stalls/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { handleServerError } from "@/lib/server-error-handling";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { z } from "zod";

// Validation schema for stall data
const StallSchema = z.object({
  stallId: z.number(),
  displayId: z.string(),
  type: z.enum(['standard', 'premium', 'corner']),
  category: z.string(),
  name: z.string(),
  price: z.string(),
  size: z.string(),
  status: z.enum(['available', 'reserved', 'blocked', 'booked'])
});

const StallConfigurationSchema = z.object({
  stalls: z.array(StallSchema)
});

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }

) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" }, 
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await context.params;
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" }, 
        { status: 404 }
      );
    }

    const isOrganizer = (session.user as { role?: string })?.role === 'organizer';
    const isEventOwner = event.organizerId.toString() === session.user.id;

    // Check authorization
    if (isOrganizer && !isEventOwner) {
      return NextResponse.json(
        { error: "You don't have permission to access this event" }, 
        { status: 401 }
      );
    }

    // Initialize stalls if they haven't been configured yet
    if (!event.stallConfiguration || event.stallConfiguration.length === 0) {
      const initialStalls = Array.from(
        { length: event.numberOfStalls }, 
        (_, i) => ({
          stallId: i + 1,
          displayId: `${i + 1}`,
          type: 'standard',
          category: event.category,
          name: '',
          price: '5000',
          size: '3x3',
          status: 'available'
        })
      );

      event.stallConfiguration = initialStalls;
      await event.save();
    }
    
    return NextResponse.json({ 
      stalls: event.stallConfiguration,
      eventCategory: event.category,
      numberOfStalls: event.numberOfStalls
    });
  } catch (error) {
    console.error("[STALLS_GET]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json(
        { error: "Unauthorized - Only organizers can configure stalls" }, 
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await context.params;
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" }, 
        { status: 404 }
      );
    }

    if (event.organizerId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to modify this event" }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the stall configuration data
    const validatedData = StallConfigurationSchema.parse(body);

    // Additional validations
    if (validatedData.stalls.length !== event.numberOfStalls) {
      return NextResponse.json(
        { error: "Number of stalls doesn't match event configuration" }, 
        { status: 400 }
      );
    }

    // Check for duplicate stallIds or displayIds
    const stallIds = new Set();
    const displayIds = new Set();
    for (const stall of validatedData.stalls) {
      if (stallIds.has(stall.stallId)) {
        return NextResponse.json(
          { error: "Duplicate stall IDs found" }, 
          { status: 400 }
        );
      }
      if (displayIds.has(stall.displayId)) {
        return NextResponse.json(
          { error: "Duplicate display IDs found" }, 
          { status: 400 }
        );
      }
      stallIds.add(stall.stallId);
      displayIds.add(stall.displayId);
    }
    
    // Update event with new stall configuration
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { 
        $set: { 
          stallConfiguration: validatedData.stalls,
          configurationComplete: true
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Failed to update stall configuration" }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: "Stall configuration updated successfully",
      stalls: updatedEvent.stallConfiguration
    });
  } catch (error) {
    console.error("[STALLS_POST]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string })?.role !== 'organizer') {
      return NextResponse.json(
        { error: "Unauthorized - Only organizers can modify stalls" }, 
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await context.params;
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" }, 
        { status: 404 }
      );
    }

    if (event.organizerId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to modify this event" }, 
        { status: 401 }
      );
    }

    const { stallId, ...stallData } = await request.json();
    
    // Validate single stall data
    const validatedStall = StallSchema.parse({ stallId, ...stallData });

    // Update specific stall
    const updatedEvent = await Event.findOneAndUpdate(
      { 
        _id: id,
        'stallConfiguration.stallId': stallId
      },
      {
        $set: {
          'stallConfiguration.$': validatedStall
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Failed to update stall" }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: "Stall updated successfully",
      stall: validatedStall
    });
  } catch (error) {
    console.error("[STALL_PATCH]", error);
    const apiError = handleServerError(error);
    return NextResponse.json(
      { error: apiError.message, errors: apiError.errors },
      { status: apiError.statusCode }
    );
  }
}