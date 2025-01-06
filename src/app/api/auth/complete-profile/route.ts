// app/api/auth/complete-profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

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

    // Update common fields
    const allowedFields = ['contact', 'address', 'companyDetails', 'accountDetails', 'selfDescription'];
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    // Update role-specific fields
    if (user.role === 'organizer') {
      if (data.profilePicture) user.profilePicture = data.profilePicture;
      if (data.age) user.age = data.age;
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
    console.error('Profile completion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function checkProfileCompletion(user: IUser): boolean {
  // Common required fields
  const commonRequired = ['contact', 'address', 'companyDetails', 'accountDetails', 'selfDescription'];
  const hasCommonFields = commonRequired.every(field => 
    user[field as keyof IUser] !== undefined && 
    user[field as keyof IUser] !== null
  );

  if (!hasCommonFields) return false;

  // Role-specific checks
  if (user.role === 'organizer') {
    // Age is required for organizers
    return user.age !== undefined && user.age !== null;
  }

  // For vendors, common fields are sufficient
  return true;
}

export type ProfileUpdateData = {
  contact?: string;
  address?: string;
  companyDetails?: {
    companyName: string;
    registrationNumber?: string;
    website?: string;
  };
  accountDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  selfDescription?: string;
  profilePicture?: string;
  age?: number;
};