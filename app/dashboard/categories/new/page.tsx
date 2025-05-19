import BackButton from '@/components/BackButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { getCategories } from '../actions'; // Updated import path
import CategoryForm from '../components/CategoryForm'; // Updated component import path

export const metadata = {
  title: "Add New Category | Admin Dashboard",
  description: "Create a new product category.",
};

export default async function NewCategoryPage() {
  const categoriesResult = await getCategories();

  // We pass all categories to the form for parent selection.
  // The form itself will handle filtering out invalid parent choices (e.g. for edit mode).
  const allCategories = categoriesResult.success ? categoriesResult.categories || [] : [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-start items-center mb-4">
        <BackButton />
        <h1 className="text-3xl font-bold ml-4">Add New Category</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm allCategories={allCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
