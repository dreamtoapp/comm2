import db from '@/lib/prisma';

import NewProductPageContent from './new-product-page-content';

interface SimpleCategory {
  id: string;
  name: string;
}

type SearchParamsPromise = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewProductPage(props: { searchParams: SearchParamsPromise }) {
  // Await the searchParams promise as per Next.js 15 async props
  const searchParams = await props.searchParams;

  // Fetch categories with error handling
  const categories: SimpleCategory[] = await db.category
    .findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
      return [];
    });

  // Extract and validate supplierId
  const initialSupplierId =
    typeof searchParams.supplierId === 'string'
      ? searchParams.supplierId
      : undefined;

  // Fetch supplier name if ID is present
  let initialSupplierName: string | null = null;
  if (initialSupplierId) {
    const supplier = await db.supplier
      .findUnique({
        where: { id: initialSupplierId },
        select: { name: true },
      })
      .catch((error) => {
        console.error(
          `Error fetching supplier name for ID ${initialSupplierId}:`,
          error
        );
        return null;
      });
    initialSupplierName = supplier?.name ?? null;
  }

  return (
    <NewProductPageContent
      categories={categories}
      initialSupplierId={initialSupplierId}
      initialSupplierName={initialSupplierName}
    />
  );
}
