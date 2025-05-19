import { notFound } from 'next/navigation';

import { getCategoryById } from '@/app/seo/actions/category';

import ViewCategorySeoPageContent from './view-category-seo-page-content';

type Props = {
  params: Promise<{ id: string }>;
};


export default async function EditCategorySeoPage({ params }: Props) {
  // Await the promise to get the resolved value
  const resolvedParams = (await params).id;

  const category = await getCategoryById(resolvedParams);

  if (!category) {
    notFound();
  }

  return <ViewCategorySeoPageContent category={category} />;
}
