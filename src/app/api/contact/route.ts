import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { z } from 'zod';

// Zod schema for input validation
const ContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = ContactSchema.parse(body);

    // Create a new contact submission
    const contact = new Contact({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message
    });

    // Save the contact submission
    const savedContact = await contact.save();

    // Return success response
    return NextResponse.json({
      message: 'Contact submission received successfully',
      contactId: savedContact._id
    }, { status: 201 });

  } catch (error) {
    // Handle validation or database errors
    console.error('Contact submission error:', error);

    if (error instanceof z.ZodError) {
      // Zod validation error
      return NextResponse.json({
        message: 'Validation Error',
        errors: error.errors
      }, { status: 400 });
    }

    // Generic server error
    return NextResponse.json({
      message: 'Failed to submit contact form'
    }, { status: 500 });
  }
}