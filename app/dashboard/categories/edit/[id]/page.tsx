import { notFound } from 'next/navigation';

import BackButton from '@/components/BackButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  getCategories,
  getCategoryById,
} from '../../actions'; // Updated import path
import CategoryForm from '../../components/CategoryForm'; // Updated component import path

export async function generateMetadata({ params }: { params: { id: string } }) {
  const categoryResult = await getCategoryById(params.id);
  if (!categoryResult.success || !categoryResult.category) {
    return {
      title: "Category Not Found | Admin Dashboard",
    };
  }
  return {
    title: `Edit Category: ${categoryResult.category.name} | Admin Dashboard`,
    description: `Edit details for the category: ${categoryResult.category.name}.`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const categoryResult = await getCategoryById(id);
  const allCategoriesResult = await getCategories();

  if (!categoryResult.success || !categoryResult.category) {
    notFound(); // Or return a custom "not found" component
  }

  const categoryToEdit = categoryResult.category;
  // The CategoryForm expects a simpler Category structure for allCategories,
  // so we map it if needed, or ensure getCategories returns the simplified version.
  // For now, assuming CategoryForm's allCategories prop can handle the full type from getCategories.
  const allCategories = allCategoriesResult.success ? allCategoriesResult.categories || [] : [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-start items-center mb-4">
        <BackButton />
        <h1 className="text-3xl font-bold ml-4">Edit Category: <span className="font-normal">{categoryToEdit.name}</span></h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm initialData={categoryToEdit} allCategories={allCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
