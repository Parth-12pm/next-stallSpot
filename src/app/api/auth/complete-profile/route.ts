// app/api/auth/complete-profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { handleImageChange } from '@/lib/image-service';
import mongoose from 'mongoose';

function checkProfileCompletion(user: mongoose.Document & IUser): boolean {
  // Check common required fields
  if (!user.name || !user.email || !user.contact || !user.address) {
    return false;
  }

  // Check company details
  if (!user.companyDetails?.companyName || 
      !user.companyDetails?.registrationType ||
      !user.companyDetails?.registrationNumber) {
    return false;
  }

  // Check bank details
  if (!user.accountDetails?.bankName ||
      !user.accountDetails?.accountNumber ||
      !user.accountDetails?.ifscCode) {
    return false;
  }

  // Check self description
  if (!user.selfDescription) {
    return false;
  }
 // Company details check only for organizers
 if (user.role === 'organizer') {
  if (!user.companyDetails?.companyName || 
      !user.companyDetails?.registrationType ||
      !user.companyDetails?.registrationNumber) {
    return false;
  }
}

// For vendors: if company details are provided, check they are complete
if (user.role === 'vendor' && user.companyDetails) {
  if (user.companyDetails.registrationNumber || user.companyDetails.registrationType) {
    if (!user.companyDetails.companyName || 
        !user.companyDetails.registrationType ||
        !user.companyDetails.registrationNumber) {
      return false;
    }
  }
}

  return true;
}

interface MongooseError extends Error {
  errors?: Record<string, { message: string }>;
  code?: number;
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

    // Handle profile picture change
    if (data.profilePicture !== user.profilePicture) {
      data.profilePicture = await handleImageChange(
        data.profilePicture,
        user.profilePicture
      );
    }

    // Update common fields
    const allowedFields = [
      'contact', 
      'address', 
      'companyDetails', 
      'accountDetails', 
      'selfDescription', 
      'profilePicture'
    ] as const;
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    // Process dateOfBirth separately
    if (data.dateOfBirth) {
      user.dateOfBirth = new Date(data.dateOfBirth);
    }

    // Check if all required fields are completed
    const isProfileComplete = checkProfileCompletion(user);
    user.profileComplete = isProfileComplete;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profileComplete: isProfileComplete
    });
  } catch (error) {
    const mongoError = error as MongooseError;
    console.error('Profile completion error:', mongoError);
    
    return NextResponse.json(
      { 
        message: mongoError.message || 'Internal server error',
        errors: mongoError.errors
      },
      { status: mongoError.code || 500 }
    );
  }
}