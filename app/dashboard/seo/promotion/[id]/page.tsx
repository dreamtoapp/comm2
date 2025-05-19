// Promotion SEO Edit Page
// Route: /dashboard/seo/promotion/[id]
import React from 'react';
import { getPromotionById } from '../actions/get-promotion-by-id';
import { getPromotionSeoByLocale } from '../actions/get-promotion-seo-by-locale';
import PromotionSeoForm from '../components/PromotionSeoForm';
import BackButton from '@/components/BackButton';

export default async function PromotionSeoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promotion = await getPromotionById(id);
  const seoByLocale = await getPromotionSeoByLocale(id);
  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">تعديل SEO للعرض: {promotion?.title}</h1>
      <PromotionSeoForm promotion={promotion} seoByLocale={seoByLocale} />
    </div>
  );
}
