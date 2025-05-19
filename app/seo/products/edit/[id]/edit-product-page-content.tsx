"use client";

import React, { useState } from 'react';

import { toast } from 'sonner'; // Assuming you use sonner for notifications

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Category,
  Product,
} from '@prisma/client';

import { updateProduct } from './actions';

interface EditProductPageContentProps {
  product: Product & {
    categoryAssignments: { category: Category }[];
  };
  categories: Category[];
}

const EditProductPageContent: React.FC<EditProductPageContentProps> = ({ product, categories }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const tags = (formData.get('tags') as string).split(',').map((tag) => tag.trim()).filter(tag => tag); // Filter empty tags

    try {
      const result = await updateProduct(product.id, metaTitle, metaDescription, tags);
      if (result.message.includes('successfully')) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 font-sans">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
          <p className="text-muted-foreground">Update product details and SEO information.</p>
          <p className="text-sm text-muted-foreground pt-2">Product ID: {product.id}</p>
          <p className="text-sm text-muted-foreground">Product Name: {product.name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SEO Information Section */}
            <div className="rounded-md border p-4 bg-muted/40">
              <h3 className="text-lg font-semibold mb-4">SEO Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title (Max 120 characters)</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    defaultValue={product.metaTitle || ''}
                    placeholder="Enter meta title for search engines"
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description (Max 320 characters)</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    defaultValue={product.metaDescription || ''}
                    placeholder="Enter meta description for search engines"
                    maxLength={320}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={product.tags.join(', ') || ''}
                placeholder="e.g., new arrival, summer collection, sale"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPageContent;
