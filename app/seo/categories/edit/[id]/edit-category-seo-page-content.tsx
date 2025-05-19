'use client';

import { useActionState } from 'react';

import { updateCategory } from '@/app/seo/categories/edit/[id]/actions';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Optional: define the response shape
type CategoryFormState = {
  success: boolean;
  message: string;
  errors: {
    metaTitle?: string[];
    metaDescription?: string[];
    id?: string[];
    keywords?: string[];
  };
  formError: string | null;
};

export default function EditCategorySeoPageContent({ category }: { category: any }) {
  const [state, formAction, isPending] = useActionState<CategoryFormState, FormData>(
    updateCategory,
    {
      success: false,
      message: '',
      errors: {},
      formError: null,
    }
  );

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Edit SEO: <span className="text-primary">{category.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Edit SEO settings for this category.
          </p>
        </div>
        <BackButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic SEO</CardTitle>
          <CardDescription>Core search engine optimization settings.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <p className="text-foreground">{category.name}</p>
            </div>

            <div>
              <Label htmlFor="categorySlug">Category Slug</Label>
              <p className="text-foreground">{category.slug}</p>
            </div>

            <input type="hidden" name="id" value={category.id} />

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                type="text"
                id="metaTitle"
                name="metaTitle"
                defaultValue={category.metaTitle || ''}
              />
              {state.errors?.metaTitle && (
                <p className="text-red-500 text-sm mt-1">{state.errors.metaTitle[0]}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                defaultValue={category.metaDescription || ''}
              />
              {state.errors?.metaDescription && (
                <p className="text-red-500 text-sm mt-1">{state.errors.metaDescription[0]}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                type="text"
                id="keywords"
                name="keywords"
                defaultValue={category.keywords?.join(', ') || ''}
              />
              {state.errors?.keywords && (
                <p className="text-red-500 text-sm mt-1">{state.errors.keywords[0]}</p>
              )}
            </div>
          </CardContent>

          <div className="p-6 pt-0 space-y-2">
            {state.formError && (
              <p className="text-red-500 text-sm">{state.formError}</p>
            )}
            {state.message && state.success && (
              <p className="text-green-600 text-sm">{state.message}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Update Category'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
