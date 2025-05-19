import React from 'react';

import ServerCarousel from './ServerCarousel';

interface Promotion {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  discountValue?: number | null;
  discountType?: string | null;
  active?: boolean;
}

interface PromotionSliderProps {
  promotions: Promotion[];
}

const SliderSection: React.FC<PromotionSliderProps> = ({ promotions }) => {
  // If no promotions, don't render the section
  if (!promotions || promotions.length === 0) {
    return null;
  }

  // Transform promotions to the format expected by ServerCarousel
  const carouselItems = promotions.map((promo) => ({
    id: promo.id,
    url: promo.imageUrl || '/fallback/fallback.avif',
    alt: promo.title,
    title: promo.title,
    description: promo.description || undefined,
    discountValue: promo.discountValue,
    discountType: promo.discountType,
    linkUrl: `/promotions/${encodeURIComponent(promo.title.toLowerCase().replace(/ /g, '-'))}-${promo.id}`,
  }));

  return (
    <section className='relative px-4 py-8'>
      <div className='container mx-auto max-w-full'>
        <ServerCarousel images={carouselItems} className='overflow-hidden rounded-xl shadow-lg' />
      </div>
    </section>
  );
};

export default SliderSection;
