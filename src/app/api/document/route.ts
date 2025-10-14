// ==================== API ROUTE ====================
// app/api/documents/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Document from "@/models/documents";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch all documents
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 'assignment' or 'experiment'

    const query = type ? { type } : {};
    const documents = await Document.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST - Upload new document
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string; // 'assignment' or 'experiment'

    if (!file || !name || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `documents/${type}`,
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Save to MongoDB
    const document = await Document.create({
      name,
      type,
      url: (result as any).secure_url,
      cloudinaryId: (result as any).public_id,
    });

    return NextResponse.json({ success: true, data: document });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

// DELETE - Delete document
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Document ID required" },
        { status: 400 }
      );
    }

    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.cloudinaryId, {
      resource_type: "raw",
    });

    // Delete from MongoDB
    await Document.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
