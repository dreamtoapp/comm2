// HomeSeoForm.tsx
import React from 'react';

import { EntityType } from '@prisma/client';

export type HomeSeoFormProps = {
  defaultValues: {
    entityId: string;
    metaTitle: string;
    metaDescription: string;
    entityType: EntityType;
    canonicalUrl: string;
    robots: string;
    keywords: string[];
    openGraphTitle: string;
    openGraphImages: string;
    twitterCardType: string;
    twitterImages: string;
    securityHeaders: string[];
    preloadAssets: string[];
    httpEquiv: string[];
    defaultLanguage: string;
    supportedLanguages: string[];
    hreflang: string;
    schemaOrg: string;
    industryData: string;
  };
  mode: 'edit' | 'create';
  id?: string;
  onSubmit?: (data: any) => void;
};

export default function HomeSeoForm({ defaultValues, mode, id, onSubmit }: HomeSeoFormProps) {
  // Minimal, clear, and custom for homepage only
  const [formState, setFormState] = React.useState(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formState);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <a href="/dashboard/seo/pixels">
          <button type="button" className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition">
            إعدادات البيكسل والتحليلات
          </button>
        </a>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="metaTitle" className="block font-medium mb-1">Meta Title</label>
          <input
            id="metaTitle"
            name="metaTitle"
            type="text"
            value={formState.metaTitle}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            maxLength={120}
            required
          />
          <div className="mt-1 text-xs text-muted-foreground">
            <a href="/dashboard/seo/pixels" className="underline hover:text-primary transition">إعدادات البيكسل والتحليلات (Google Analytics, Facebook Pixel, ...)</a>
          </div>
        </div>
        <div>
          <label htmlFor="metaDescription" className="block font-medium mb-1">Meta Description</label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formState.metaDescription}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            maxLength={320}
            required
          />
          <div className="mt-1 text-xs text-muted-foreground">
            <a href="/dashboard/seo/pixels" className="underline hover:text-primary transition">إعدادات البيكسل والتحليلات (Google Analytics, Facebook Pixel, ...)</a>
          </div>
        </div>
        {/* Add more fields as needed for homepage SEO */}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          {mode === 'edit' ? 'Update SEO' : 'Create SEO'}
        </button>
      </form>
    </>
  );
}
