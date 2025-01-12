// lib/event-upload.ts
import { uploadImage, deleteImage } from './cloudinary';
import { extractPublicIdFromUrl } from './image-service';

interface EventUploadResult {
  thumbnailUrl?: string;
  layoutUrl?: string;
}

export async function handleEventImageUploads(
  thumbnailFile?: File | null,
  layoutFile?: File | null,
  oldThumbnail?: string,
  oldLayout?: string
): Promise<EventUploadResult> {
  const result: EventUploadResult = {};

  try {
    // Handle thumbnail upload
    if (thumbnailFile) {
      if (oldThumbnail) {
        const publicId = extractPublicIdFromUrl(oldThumbnail);
        if (publicId) await deleteImage(publicId);
      }
      const thumbnailResult = await uploadImage(thumbnailFile, 'events/thumbnails');
      result.thumbnailUrl = thumbnailResult.secure_url;
    }

    // Handle layout upload
    if (layoutFile) {
      if (oldLayout) {
        const publicId = extractPublicIdFromUrl(oldLayout);
        if (publicId) await deleteImage(publicId);
      }
      const layoutResult = await uploadImage(layoutFile, 'events/layouts');
      result.layoutUrl = layoutResult.secure_url;
    }

    return result;
  } catch (error) {
    console.error('Error handling event uploads:', error);
    throw new Error('Failed to upload event images');
  }
}