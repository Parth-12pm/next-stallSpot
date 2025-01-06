// lib/image-service.ts
import { deleteImage } from '@/lib/cloudinary';

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const matches = url.match(/\/v\d+\/([^/]+)\.[^.]+$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
};

export const handleImageChange = async (
  newImageUrl: string,
  oldImageUrl?: string
) => {
  // If there's an old image, delete it from Cloudinary
  if (oldImageUrl) {
    const publicId = extractPublicIdFromUrl(oldImageUrl);
    if (publicId) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }
  }
  return newImageUrl;
};