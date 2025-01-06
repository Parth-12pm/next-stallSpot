// lib/cloudinary.ts

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: File, folder: string = 'profiles') => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUrl,
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'svg'],
          transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else if (result && 'secure_url' in result && 'public_id' in result) {
            resolve(result as CloudinaryUploadResult);
          } else {
            reject(new Error('Invalid upload response'));
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete image');
  }
};