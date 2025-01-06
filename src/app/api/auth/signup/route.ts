// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // Basic validation
    if (!email?.trim()) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password?.trim()) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!role || !['organizer', 'vendor'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with minimal required fields
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({
      user: userResponse,
      message: 'Registration successful'
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}