// This file is a compatibility layer for legacy imports from '@/lib/cloudinary'.
// It re-exports the main Cloudinary upload function from the new folder-based structure.
// If you need more utilities, add them as needed.

export { ImageToCloudinary as uploadImageToCloudinary } from './cloudinary/uploadImageToCloudinary';
