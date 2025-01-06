// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadImage } from '@/lib/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Basic validations
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG and PNG are allowed.' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}