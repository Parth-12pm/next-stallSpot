// app/api/auth/complete-profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

interface MongooseValidationError extends Error {
  errors?: {
    [key: string]: {
      message: string;
      path: string;
    };
  };
  name: string;
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // For vendors, if no company details are provided, set to undefined
    if (user.role === 'vendor' && !data.companyDetails?.companyName) {
      data.companyDetails = undefined;
    }

    // Update user fields
    const allowedFields = [
      'contact', 
      'address', 
      'companyDetails', 
      'accountDetails', 
      'selfDescription', 
      'profilePicture',
      'dateOfBirth'
    ];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    // Mark profile as complete
    user.profileComplete = true;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profileComplete: true
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    
    // Handle Mongoose validation errors
    if ((error as MongooseValidationError).name === 'ValidationError') {
      const validationError = error as MongooseValidationError;
      const errors = Object.values(validationError.errors || {}).map(err => ({
        field: err.path,
        message: err.message
      }));

      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}