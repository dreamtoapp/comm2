import { StaticImageData } from 'next/image';

export interface CarouselImage {
  id: string;
  src: string | StaticImageData; // Use 'src' for consistency with next/image
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  discountValue?: number | null;
  discountType?: string | null;
  linkUrl?: string;
}
