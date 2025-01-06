// app/api/profile/complete-profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { handleImageChange } from '@/lib/image-service';

// Helper function to check profile completion
function checkProfileCompletion(user: IUser): boolean {
  // Check common required fields
  if (!user.name || !user.email || !user.dateOfBirth || !user.contact || !user.address) {
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

  return true;
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
      'name',
      'dateOfBirth',
      'contact', 
      'address', 
      'companyDetails', 
      'accountDetails', 
      'selfDescription', 
      'profilePicture'
    ];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    // Check if all required fields are completed
    const isProfileComplete = checkProfileCompletion(user);
    user.profileComplete = isProfileComplete;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profileComplete: isProfileComplete,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profileComplete: user.profileComplete,
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}