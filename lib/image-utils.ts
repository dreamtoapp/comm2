import sharp from 'sharp';
import { getPlaiceholder } from 'plaiceholder';

export interface ImageMetadata {
  width: number;
  height: number;
  aspectRatio: number;
  blurDataURL: string;
}

export async function generateImageMetadata(imagePath: string): Promise<ImageMetadata> {
  try {
    // Get image dimensions and metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Read the image file as buffer
    const imageBuffer = await sharp(imagePath).toBuffer();
    
    // Generate blur placeholder
    const { base64: blurDataURL } = await getPlaiceholder(imageBuffer, {
      size: 10, // Small size for performance
    });
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      aspectRatio: (metadata.width || 0) / (metadata.height || 0),
      blurDataURL
    };
  } catch (error) {
    console.error('Error generating image metadata:', error);
    throw error;
  }
}
