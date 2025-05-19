// Category SEO Edit Page
// Route: /dashboard/seo/category/[id]
import React from 'react';
import { getCategoryById } from '../actions/get-category-by-id';
import { getCategorySeoByLocale } from '../actions/get-category-seo-by-locale';
import CategorySeoForm from '../components/CategorySeoForm';
import BackButton from '../../product/components/BackButton';

export default async function CategorySeoEditPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);
  const seoByLocale = await getCategorySeoByLocale(params.id);
  return (
    <div>
      <BackButton href="/dashboard/seo/category" />
      <h1 className="text-2xl font-bold mb-4">تعديل SEO للصنف: {category?.title}</h1>
      <CategorySeoForm category={category} seoByLocale={seoByLocale} />
    </div>
  );
}
