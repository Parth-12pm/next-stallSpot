// app/api/auth/complete-profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import mongoose from 'mongoose';
import { handleImageChange } from '@/lib/image-service';

type CompanyDetails = NonNullable<IUser['companyDetails']>;

interface ValidationData {
  contact?: string;
  address?: string;
  dateOfBirth?: string | Date;
  companyDetails?: CompanyDetails;
  accountDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  selfDescription?: string;
  profilePicture?: string;
}

function validateProfileData(data: ValidationData, role: string): string[] {
  const errors: string[] = [];

  // Validate common required fields
  if (!data.contact) errors.push('Contact is required');
  if (!data.address) errors.push('Address is required');
  if (!data.dateOfBirth) errors.push('Date of birth is required');
  if (!data.selfDescription) errors.push('Self description is required');

  // Validate account details
  if (!data.accountDetails?.bankName) errors.push('Bank name is required');
  if (!data.accountDetails?.accountNumber) errors.push('Account number is required');
  if (!data.accountDetails?.ifscCode) errors.push('IFSC code is required');

  // Company details validation
  if (role === 'organizer') {
    if (!data.companyDetails?.companyName) errors.push('Company name is required for organizers');
    if (!data.companyDetails?.registrationType) errors.push('Registration type is required for organizers');
    if (!data.companyDetails?.registrationNumber) errors.push('Registration number is required for organizers');
  } else if (role === 'vendor' && data.companyDetails) {
    const hasAnyDetail = !!(
      data.companyDetails.companyName ||
      data.companyDetails.registrationType ||
      data.companyDetails.registrationNumber
    );

    if (hasAnyDetail) {
      if (!data.companyDetails.companyName) errors.push('Company name is required when providing company details');
      if (!data.companyDetails.registrationType) errors.push('Registration type is required when providing company details');
      if (!data.companyDetails.registrationNumber) errors.push('Registration number is required when providing company details');
    }
  }

  return errors;
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

    // Pre-validate the data
    const validationErrors = validateProfileData(data, user.role);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: validationErrors.map(message => ({ field: '', message }))
        },
        { status: 400 }
      );
    }

    // Handle profile picture change
    if (data.profilePicture !== user.profilePicture) {
      data.profilePicture = await handleImageChange(
        data.profilePicture,
        user.profilePicture
      );
    }

    // Handle company details for vendors
    if (user.role === 'vendor' && !data.companyDetails?.companyName) {
      data.companyDetails = undefined;
    }

    // Update fields
    const allowedFields = [
      'contact',
      'address',
      'companyDetails',
      'accountDetails',
      'selfDescription',
      'profilePicture',
      'dateOfBirth'
    ] as const;

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        if (field === 'dateOfBirth') {
          user[field] = new Date(data[field]);
        } else {
          user[field] = data[field];
        }
      }
    });

    // Mark profile as complete and save
    user.profileComplete = true;
    await user.save();

    // Create updated session data
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        profileComplete: true
      }
    };

    return NextResponse.json({
      message: 'Profile updated successfully',
      profileComplete: true,
      session: updatedSession
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => ({
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

    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Internal server error',
        errors: [{ field: '', message: error instanceof Error ? error.message : 'Internal server error' }]
      },
      { status: 500 }
    );
  }
}