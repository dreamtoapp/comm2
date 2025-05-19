import { notFound } from 'next/navigation';

import db from '@/lib/prisma';

import EditProductPageContent from './edit-product-page-content';

// Update props type for Next.js 15+ where params is a Promise
interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProductById(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      supplier: true,
      categoryAssignments: { include: { category: true } },
    },
  });
  if (!product) {
    notFound(); // Ensure notFound is called if product doesn't exist
  }
  return product;
}

async function getCategories() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories;
}

// Adjust component signature to accept props and await params
export default async function EditProductPage(props: EditProductPageProps) {
  // Await the params promise to get the actual params object
  const params = await props.params;
  const { id } = params; // Now we can safely destructure id

  // Fetch product data using the resolved id
  const productData = await getProductById(id);
  const categories = await getCategories();

  const transformedProduct = {
    ...productData,
  };

  return (
    <EditProductPageContent
      product={transformedProduct}
      categories={categories}
    />
  );
}
