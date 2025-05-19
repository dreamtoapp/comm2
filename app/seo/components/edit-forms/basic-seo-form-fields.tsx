'use client';

import type React from 'react';
// Removed useEffect, useState, useRouter, updateSeoEntry, ServerActionResult, SeoFormData (will be handled by parent)
import { Info } from 'lucide-react';
import { EntityType, IndustryType } from '@prisma/client'; // Keep for displaying EntityType and IndustryType values

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Define the shape of the form data this component handles
export type BasicSeoFormDataSubset = {
  entityId: string; // Read-only on this form, set by parent
  entityType: EntityType; // Read-only on this form, set by parent
  industryType: IndustryType;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  keywords: string[]; // Will be handled as a comma-separated string in input
};

type BasicSeoFormFieldsProps = {
  formData: BasicSeoFormDataSubset;
  errors: Record<string, string[] | undefined>;
  // isSubmitting: boolean; // Handled by parent
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectValueChange: (name: keyof BasicSeoFormDataSubset, value: string) => void;
  handleKeywordsChange: (value: string) => void; // Parent will handle parsing to array
};

export default function BasicSeoFormFields({
  formData,
  errors,
  handleChange,
  handleSelectValueChange,
  handleKeywordsChange,
}: BasicSeoFormFieldsProps) {

  const formatKeywordsForInput = (keywords: string[] | undefined): string => {
    return keywords ? keywords.join(', ') : '';
  };

  return (
    <> {/* Changed from form to Fragment */}
      <div className='grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2'>
        <div className="space-y-2">
          <Label htmlFor='entityIdDisplay' className="flex items-center">Entity ID / Slug</Label>
          <Input
            type='text'
            id='entityIdDisplay'
            name='entityId' // Name still useful for potential future direct handling
            value={formData.entityId}
            readOnly
            className="bg-muted"
          />
          <p className='text-sm text-muted-foreground'>Identifier for the page, product, or category.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor='entityTypeDisplay' className="flex items-center">Entity Type</Label>
          <Input
            type="text"
            id="entityTypeDisplay"
            value={formData.entityType.charAt(0) + formData.entityType.slice(1).toLowerCase().replace(/_/g, ' ')}
            readOnly
            className="bg-muted"
          />
          <p className='text-sm text-muted-foreground'>Type of content (Page, Product, Category, etc.).</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor='industryType' className="flex items-center">Industry Type</Label>
        <Select
          name="industryType"
          value={formData.industryType}
          onValueChange={(value) => handleSelectValueChange('industryType', value as IndustryType)}
        >
          <SelectTrigger id="industryType" className={`${errors.industryType ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select industry type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(IndustryType).map((typeValue: IndustryType) => (
              <SelectItem key={typeValue} value={typeValue}>
                {typeValue.charAt(0) + typeValue.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industryType && <p className='text-sm text-destructive'>{errors.industryType[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor='metaTitle' className="flex items-center">Meta Title</Label>
        <Input
          type='text'
          id='metaTitle'
          name='metaTitle'
          value={formData.metaTitle}
          onChange={handleChange}
          maxLength={120}
          className={`${errors.metaTitle ? 'border-destructive' : ''}`}
        />
        {errors.metaTitle && <p className='text-sm text-destructive'>{errors.metaTitle[0]}</p>}
        <p className='text-sm text-muted-foreground'>Max 120 chars. Current: {formData.metaTitle?.length || 0}/120</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor='metaDescription' className="flex items-center">Meta Description</Label>
        <Textarea
          id='metaDescription'
          name='metaDescription'
          value={formData.metaDescription}
          onChange={handleChange}
          maxLength={320}
          rows={3}
          className={`${errors.metaDescription ? 'border-destructive' : ''}`}
        />
        {errors.metaDescription && <p className='text-sm text-destructive'>{errors.metaDescription[0]}</p>}
        <p className='text-sm text-muted-foreground'>Max 320 chars. Current: {formData.metaDescription?.length || 0}/320</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor='canonicalUrl' className="flex items-center">Canonical URL</Label>
        <Input
          type='text'
          id='canonicalUrl'
          name='canonicalUrl'
          value={formData.canonicalUrl || ''}
          onChange={handleChange}
          className={`${errors.canonicalUrl ? 'border-destructive' : ''}`}
          placeholder='https://example.com/preferred-page-url'
        />
        {errors.canonicalUrl && <p className='text-sm text-destructive'>{errors.canonicalUrl[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor='robots' className="flex items-center">Robots Directive</Label>
        <Select
          name="robots"
          value={formData.robots}
          onValueChange={(value) => handleSelectValueChange('robots', value)}
        >
          <SelectTrigger id="robots" className={`${errors.robots ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select robots directive" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='index, follow'>index, follow (Recommended)</SelectItem>
            <SelectItem value='noindex, follow'>noindex, follow</SelectItem>
            <SelectItem value='index, nofollow'>index, nofollow</SelectItem>
            <SelectItem value='noindex, nofollow'>noindex, nofollow</SelectItem>
          </SelectContent>
        </Select>
        {errors.robots && <p className='text-sm text-destructive'>{errors.robots[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor='keywords' className="flex items-center">Keywords</Label>
        <Input
          type='text'
          id='keywords'
          name='keywords' // Name is 'keywords' but value is string, parent handles conversion
          value={formatKeywordsForInput(formData.keywords)}
          onChange={(e) => handleKeywordsChange(e.target.value)}
          className={`${errors.keywords ? 'border-destructive' : ''}`}
          placeholder='e.g., e-commerce, saudi arabia, online shopping'
        />
        {errors.keywords && <p className='text-sm text-destructive'>{errors.keywords[0]}</p>}
        <p className='text-sm text-muted-foreground'>Comma-separated keywords for this page.</p>
      </div>
      {/* Submit button removed */}
    </>
  );
}
