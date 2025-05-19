import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { getCategories } from './actions';
import CategoryDataTable from './components/CategoryDataTable';

export const metadata = {
  title: "إدارة الأصناف | لوحة التحكم",
  description: "عرض، إنشاء، تعديل، وحذف أصناف المنتجات.",
};

export default async function CategoriesPage() {
  const result = await getCategories();

  if (!result.success) {
    // Consider a more user-friendly error display or logging
    return <p className="text-red-500">خطأ: {result.error}</p>;
  }

  const categories = result.categories || [];

  return (
    <div className="container mx-auto py-10" dir="rtl"> {/* Added RTL direction */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة الأصناف</h1>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <PlusCircle className="ml-2 h-4 w-4" /> {/* Adjusted margin for RTL */}
            إضافة صنف جديد
          </Link>
        </Button>
      </div>
      {categories.length > 0 ? (
        <CategoryDataTable categories={categories} />
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">لم يتم العثور على أصناف.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/categories/new">
              <PlusCircle className="ml-2 h-4 w-4" /> {/* Adjusted margin for RTL */}
              إنشاء أول صنف لك
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
