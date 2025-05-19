'use server';
import { uploadImageToCloudinary } from '../../../../lib/cloudinary';

/**
 * Helper function to upload an image to Cloudinary.
 */
export async function uploadImage(
  imageFile: File,
): Promise<{ secure_url: string; public_id: string }> {
  try {
    const cloudinaryResponse = await uploadImageToCloudinary(
      imageFile,
      process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '',
    );
    return {
      secure_url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
    };
  } catch (e) {
    let errorMessage = 'Failed to upload image to Cloudinary.';
    if (e instanceof Error) {
      errorMessage = `${errorMessage} ${e.message}`;
    }
    console.error('Error uploading image to Cloudinary:', errorMessage);
    throw new Error(errorMessage);
  }
}
