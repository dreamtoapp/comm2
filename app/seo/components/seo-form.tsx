'use client';

import type React from 'react';
import { useState } from 'react';

import {
  Info,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  createSeoEntry,
  type SeoFormData,
  type ServerActionResult,
} from '@/app/seo/actions/seo';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  EntityType,
  IndustryType,
} from '@prisma/client'; // Added EntityType

type SeoFormProps = {
  defaultValues: SeoFormData;
  mode: 'create' | 'edit';
  id?: string;
  // Optional: to pre-set and potentially hide entityType for specific forms
  // e.g., on a product SEO form, entityType would be PRODUCT and read-only.
  fixedEntityType?: EntityType;
};

export default function SeoForm({ defaultValues, mode, id, fixedEntityType }: SeoFormProps) {
  const router = useRouter();
  // Ensure defaultValues includes entityType, defaulting to PAGE if not provided or if fixedEntityType is not set
  const initialFormData = {
    ...defaultValues,
    entityType: fixedEntityType || defaultValues.entityType || EntityType.PAGE,
  };
  const [formData, setFormData] = useState<SeoFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectValueChange = (name: keyof SeoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (name: keyof SeoFormData, value: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addToArray = (name: keyof SeoFormData, value: string) => {
    if (!value.trim()) return;
    const currentArray = (formData[name] as string[] | undefined) || [];
    handleArrayChange(name, [...currentArray, value.trim()]);
  };

  const removeFromArray = (name: keyof SeoFormData, index: number) => {
    const currentArray = (formData[name] as string[] | undefined) || [];
    handleArrayChange(
      name,
      currentArray.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Ensure entityType is part of the submission, especially if fixed
    const dataToSubmit = {
      ...formData,
      entityType: fixedEntityType || formData.entityType,
    };

    try {
      const result: ServerActionResult =
        mode === 'create' ? await createSeoEntry(dataToSubmit) : await updateSeoEntry(id!, dataToSubmit);

      if (result.success) {
        router.push('/seo'); // Or a more specific path based on entityType if needed
        router.refresh();
        return;
      }

      if (!result.success) {
        setErrors(result.errors ? result.errors : {});
        const firstErrorField = Object.keys(result.errors)[0];
        if (firstErrorField && firstErrorField !== '_form') {
          const element = document.getElementById(firstErrorField);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus({ preventScroll: true });
          }
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ _form: ['An unexpected error occurred'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeywordsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const keywordsArray = value
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    handleArrayChange('keywords', keywordsArray);
  };

  const formatKeywords = (keywords: string[] | undefined) => {
    return keywords ? keywords.join(', ') : '';
  };

  const isValidJson = (str: string | null | undefined): boolean => {
    if (str === null || str === undefined || str.trim() === '') return true;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    // <TooltipProvider> // Temporarily removed for debugging
    <form onSubmit={handleSubmit} className='space-y-8'>
      {errors._form && (
        <div className='rounded border border-destructive bg-destructive/10 px-4 py-3 text-destructive'>
          {errors._form.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 pt-6">
          <div className='grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2'>
            <div className="space-y-2">
              <Label htmlFor='entityId' className="flex items-center">
                Entity ID / Slug
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                      <Info size={14} className="text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unique ID or slug for this entity (e.g., product ID, 'homepage', 'about-us').</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                type='text'
                id='entityId'
                name='entityId'
                value={formData.entityId}
                onChange={handleChange}
                className={`${errors.entityId ? 'border-destructive' : ''}`}
                readOnly={mode === 'edit' && !!fixedEntityType} // ReadOnly if entityType is fixed (e.g. product form)
                aria-describedby="entityId-error entityId-help"
              />
              {errors.entityId && Array.isArray(errors.entityId) && (
  <p id="entityId-error" className='text-sm text-destructive'>{errors.entityId[0]}</p>
)}
              <p id="entityId-help" className='text-sm text-muted-foreground'>Identifier for the page, product, or category.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor='entityType' className="flex items-center">
                Entity Type
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                      <Info size={14} className="text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The type of content these SEO settings apply to.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              {fixedEntityType ? (
                <Input
                  type="text"
                  value={fixedEntityType}
                  readOnly
                  className="bg-muted"
                />
              ) : (
                <Select
                  name="entityType"
                  value={formData.entityType}
                  onValueChange={(value) => handleSelectValueChange('entityType', value)}
                >
                  <SelectTrigger id="entityType" className={`${errors.entityType ? 'border-destructive' : ''}`} aria-describedby="entityType-error entityType-help">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EntityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.entityType && (
                <p id="entityType-error" className='text-sm text-destructive'>{errors.entityType[0]}</p>
              )}
              <p id="entityType-help" className='text-sm text-muted-foreground'>Type of content (Page, Product, Category, etc.).</p>
            </div>
          </div>

          <div className="space-y-2"> {/* Industry Type moved here to be full width */}
            <Label htmlFor='industryType' className="flex items-center">
              Industry Type
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the industry category. This can help tailor advanced SEO settings.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select
              name="industryType"
              value={formData.industryType}
              onValueChange={(value) => handleSelectValueChange('industryType', value)}
            >
              <SelectTrigger id="industryType" className={`${errors.industryType ? 'border-destructive' : ''}`} aria-describedby="industryType-error industryType-help">
                <SelectValue placeholder="Select industry type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(IndustryType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industryType && (
              <p id="industryType-error" className='text-sm text-destructive'>{errors.industryType[0]}</p>
            )}
            <p id="industryType-help" className='text-sm text-muted-foreground'>The industry category for this SEO entry.</p>
          </div>


          <div className="space-y-2">
            <Label htmlFor='metaTitle' className="flex items-center">
              Meta Title
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The title that appears in search results and browser tabs. Aim for 50-60 characters.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type='text'
              id='metaTitle'
              name='metaTitle'
              value={formData.metaTitle}
              onChange={handleChange}
              maxLength={120}
              className={`${errors.metaTitle ? 'border-destructive' : ''}`}
              aria-describedby="metaTitle-error metaTitle-help"
            />
            {errors.metaTitle && <p id="metaTitle-error" className='text-sm text-destructive'>{errors.metaTitle[0]}</p>}
            <p id="metaTitle-help" className='text-sm text-muted-foreground'>
              Max 120 chars. Current: {formData.metaTitle?.length || 0}/120
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='metaDescription' className="flex items-center">
              Meta Description
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>A brief summary (150-160 chars) for search results. Make it compelling!</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id='metaDescription'
              name='metaDescription'
              value={formData.metaDescription}
              onChange={handleChange}
              maxLength={320}
              rows={3}
              className={`${errors.metaDescription ? 'border-destructive' : ''}`}
              aria-describedby="metaDescription-error metaDescription-help"
            />
            {errors.metaDescription && (
              <p id="metaDescription-error" className='text-sm text-destructive'>{errors.metaDescription[0]}</p>
            )}
            <p id="metaDescription-help" className='text-sm text-muted-foreground'>
              Max 320 chars. Current: {formData.metaDescription?.length || 0}/320
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='canonicalUrl' className="flex items-center">
              Canonical URL
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>If this page's content is similar to another, enter the main URL here. Optional.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type='text'
              id='canonicalUrl'
              name='canonicalUrl'
              value={formData.canonicalUrl || ''}
              onChange={handleChange}
              className={`${errors.canonicalUrl ? 'border-destructive' : ''}`}
              placeholder='https://example.com/preferred-page-url'
              aria-describedby="canonicalUrl-error canonicalUrl-help"
            />
            {errors.canonicalUrl && (
              <p id="canonicalUrl-error" className='text-sm text-destructive'>{errors.canonicalUrl[0]}</p>
            )}
            <p id="canonicalUrl-help" className='text-sm text-muted-foreground'>The preferred URL for this page (optional).</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='robots' className="flex items-center">
              Robots Directive
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Instructs search engines. 'index, follow' is standard.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select
              name="robots"
              value={formData.robots}
              onValueChange={(value) => handleSelectValueChange('robots', value)}
            >
              <SelectTrigger id="robots" className={`${errors.robots ? 'border-destructive' : ''}`} aria-describedby="robots-error robots-help">
                <SelectValue placeholder="Select robots directive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='index, follow'>index, follow (Recommended)</SelectItem>
                <SelectItem value='noindex, follow'>noindex, follow</SelectItem>
                <SelectItem value='index, nofollow'>index, nofollow</SelectItem>
                <SelectItem value='noindex, nofollow'>noindex, nofollow</SelectItem>
              </SelectContent>
            </Select>
            {errors.robots && <p id="robots-error" className='text-sm text-destructive'>{errors.robots[0]}</p>}
            <p id="robots-help" className='text-sm text-muted-foreground'>
              Controls search engine crawling and indexing.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='keywords' className="flex items-center">
              Keywords
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comma-separated keywords. Less critical for modern SEO but can be useful.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type='text'
              id='keywords'
              name='keywords'
              value={formatKeywords(formData.keywords)}
              onChange={handleKeywordsInput}
              className={`${errors.keywords ? 'border-destructive' : ''}`}
              placeholder='e.g., e-commerce, saudi arabia, online shopping'
              aria-describedby="keywords-error keywords-help"
            />
            {errors.keywords && <p id="keywords-error" className='text-sm text-destructive'>{errors.keywords[0]}</p>}
            <p id="keywords-help" className='text-sm text-muted-foreground'>Comma-separated keywords for this page.</p>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6 pt-6">
          {/* Social Media fields */}
          <div className="space-y-2">
            <Label htmlFor='openGraphTitle' className="flex items-center">
              Open Graph Title
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Title used for social media sharing (e.g., Facebook, LinkedIn). If empty, the Meta Title will be used.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type='text'
              id='openGraphTitle'
              name='openGraphTitle'
              value={formData.openGraphTitle || ''}
              onChange={handleChange}
              className={`${errors.openGraphTitle ? 'border-destructive' : ''}`}
              placeholder='Title for social sharing'
              aria-describedby="ogTitle-error ogTitle-help"
            />
            {errors.openGraphTitle && <p id="ogTitle-error" className='text-sm text-destructive'>{errors.openGraphTitle[0]}</p>}
            <p id="ogTitle-help" className='text-sm text-muted-foreground'>Leave empty to use Meta Title. Recommended: 60-90 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='openGraphImages' className="flex items-center">
              Open Graph Images (JSON)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>JSON array of image objects (e.g., '[&lbrace;"url": "image.jpg", "width": 1200, "height": 630, "alt": "Alt text"&rbrace;]'). Recommended 1200x630px.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id='openGraphImages'
              name='openGraphImages'
              value={formData.openGraphImages || ''}
              onChange={handleChange}
              rows={5}
              className={`${errors.openGraphImages || !isValidJson(formData.openGraphImages) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='[{"url": "https://example.com/og-image.jpg", "width": 1200, "height": 630, "alt": "Description"}]'
              aria-describedby="ogImages-error ogImages-help"
            />
            {errors.openGraphImages && <p id="ogImages-error" className='text-sm text-destructive'>{errors.openGraphImages[0]}</p>}
            {!isValidJson(formData.openGraphImages) && !errors.openGraphImages && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
            <p id="ogImages-help" className='text-sm text-muted-foreground'>Enter a JSON array of image objects. See tooltip for structure.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='twitterCardType' className="flex items-center">
              Twitter Card Type
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The type of Twitter card to use when this page is shared on Twitter.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Select
              name="twitterCardType"
              value={formData.twitterCardType || ''}
              onValueChange={(value) => handleSelectValueChange('twitterCardType', value)}
            >
              <SelectTrigger id="twitterCardType" className={`${errors.twitterCardType ? 'border-destructive' : ''}`} aria-describedby="twitterCard-error twitterCard-help">
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>None (use Open Graph)</SelectItem>
                <SelectItem value='summary'>Summary</SelectItem>
                <SelectItem value='summary_large_image'>Summary with Large Image</SelectItem>
                <SelectItem value='app'>App</SelectItem>
                <SelectItem value='player'>Player</SelectItem>
              </SelectContent>
            </Select>
            {errors.twitterCardType && <p id="twitterCard-error" className='text-sm text-destructive'>{errors.twitterCardType[0]}</p>}
            <p id="twitterCard-help" className='text-sm text-muted-foreground'>Select the Twitter card type (optional).</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='twitterImages' className="flex items-center">
              Twitter Images (JSON)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>JSON array of image objects for Twitter cards (e.g., '[&lbrace;"url": "image.jpg", "alt": "Alt text"&rbrace;]'). If empty, Open Graph images may be used.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id='twitterImages'
              name='twitterImages'
              value={formData.twitterImages || ''}
              onChange={handleChange}
              rows={5}
              className={`${errors.twitterImages || !isValidJson(formData.twitterImages) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='[{"url": "https://example.com/twitter-image.jpg", "alt": "Description"}]'
              aria-describedby="twitterImages-error twitterImages-help"
            />
            {errors.twitterImages && <p id="twitterImages-error" className='text-sm text-destructive'>{errors.twitterImages[0]}</p>}
            {!isValidJson(formData.twitterImages) && !errors.twitterImages && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
            <p id="twitterImages-help" className='text-sm text-muted-foreground'>Enter a JSON array of image objects for Twitter (optional).</p>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6 pt-6">
          {/* Technical SEO fields */}
          <div className="space-y-2">
            <Label className="flex items-center">
              Security Headers
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>HTTP headers that enhance security (e.g., X-Frame-Options). Add one per input.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            {(formData.securityHeaders || []).map((header, index) => (
              <div key={`security-${index}`} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={header}
                  onChange={(e) => {
                    const newHeaders = [...(formData.securityHeaders || [])];
                    newHeaders[index] = e.target.value;
                    handleArrayChange('securityHeaders', newHeaders);
                  }}
                  placeholder="e.g., X-Content-Type-Options: nosniff"
                  className={`${errors.securityHeaders?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('securityHeaders', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                id="newSecurityHeader"
                placeholder="Add new security header"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('securityHeaders', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newSecurityHeader') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addToArray('securityHeaders', input.value);
                    input.value = '';
                  }
                }}
              >
                Add Header
              </Button>
            </div>
            {errors.securityHeaders && !Array.isArray(errors.securityHeaders) && <p className='text-sm text-destructive'>{errors.securityHeaders}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Preload Assets
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>URLs of critical assets (fonts, scripts) to preload for faster rendering.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            {(formData.preloadAssets || []).map((asset, index) => (
              <div key={`preload-${index}`} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={asset}
                  onChange={(e) => {
                    const newAssets = [...(formData.preloadAssets || [])];
                    newAssets[index] = e.target.value;
                    handleArrayChange('preloadAssets', newAssets);
                  }}
                  placeholder="e.g., /fonts/myfont.woff2"
                  className={`${errors.preloadAssets?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('preloadAssets', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                id="newPreloadAsset"
                placeholder="Add asset URL to preload"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('preloadAssets', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newPreloadAsset') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addToArray('preloadAssets', input.value);
                    input.value = '';
                  }
                }}
              >
                Add Asset
              </Button>
            </div>
            {errors.preloadAssets && !Array.isArray(errors.preloadAssets) && <p className='text-sm text-destructive'>{errors.preloadAssets}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              HTTP-Equiv Tags
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Meta tags that simulate HTTP headers (e.g., content-language). Use with caution.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            {(formData.httpEquiv || []).map((equiv, index) => (
              <div key={`httpEquiv-${index}`} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={equiv}
                  onChange={(e) => {
                    const newEquivs = [...(formData.httpEquiv || [])];
                    newEquivs[index] = e.target.value;
                    handleArrayChange('httpEquiv', newEquivs);
                  }}
                  placeholder="e.g., content-language: ar-SA"
                  className={`${errors.httpEquiv?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('httpEquiv', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                id="newHttpEquiv"
                placeholder="Add HTTP-equiv tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('httpEquiv', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newHttpEquiv') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addToArray('httpEquiv', input.value);
                    input.value = '';
                  }
                }}
              >
                Add Tag
              </Button>
            </div>
            {errors.httpEquiv && !Array.isArray(errors.httpEquiv) && <p className='text-sm text-destructive'>{errors.httpEquiv}</p>}
          </div>
        </TabsContent>

        <TabsContent value="localization" className="space-y-6 pt-6">
          {/* Localization fields */}
          <div className="space-y-2">
            <Label htmlFor='defaultLanguage' className="flex items-center">
              Default Language
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The primary language code for this page (e.g., ar-SA, en-US).</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              type='text'
              id='defaultLanguage'
              name='defaultLanguage'
              value={formData.defaultLanguage}
              onChange={handleChange}
              className={`${errors.defaultLanguage ? 'border-destructive' : ''}`}
              placeholder='e.g., ar-SA'
              aria-describedby="defaultLang-error defaultLang-help"
            />
            {errors.defaultLanguage && <p id="defaultLang-error" className='text-sm text-destructive'>{errors.defaultLanguage[0]}</p>}
            <p id="defaultLang-help" className='text-sm text-muted-foreground'>Enter the default language code.</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              Supported Languages
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Additional language codes supported by this page (e.g., en-US, fr-FR).</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            {(formData.supportedLanguages || []).map((lang, index) => (
              <div key={`lang-${index}`} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={lang}
                  onChange={(e) => {
                    const newLangs = [...(formData.supportedLanguages || [])];
                    newLangs[index] = e.target.value;
                    handleArrayChange('supportedLanguages', newLangs);
                  }}
                  placeholder="e.g., en-US"
                  className={`${errors.supportedLanguages?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('supportedLanguages', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                id="newSupportedLanguage"
                placeholder="Add language code"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('supportedLanguages', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newSupportedLanguage') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addToArray('supportedLanguages', input.value);
                    input.value = '';
                  }
                }}
              >
                Add Language
              </Button>
            </div>
            {errors.supportedLanguages && !Array.isArray(errors.supportedLanguages) && <p className='text-sm text-destructive'>{errors.supportedLanguages}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor='hreflang' className="flex items-center">
              Hreflang Links (JSON)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>JSON object mapping language codes to alternate URLs for this content. E.g., {"{"}en-US{"}"}: "https://example.com/en/page".</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id='hreflang'
              name='hreflang'
              value={formData.hreflang || ''}
              onChange={handleChange}
              rows={5}
              className={`${errors.hreflang || !isValidJson(formData.hreflang) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='{"en-US": "https://example.com/en/my-page", "es-ES": "https://example.com/es/mi-pagina"}'
              aria-describedby="hreflang-error hreflang-help"
            />
            {errors.hreflang && <p id="hreflang-error" className='text-sm text-destructive'>{errors.hreflang[0]}</p>}
            {!isValidJson(formData.hreflang) && !errors.hreflang && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
            <p id="hreflang-help" className='text-sm text-muted-foreground'>Enter a JSON object mapping language codes to URLs.</p>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor='schemaOrg' className="flex items-center">
              Schema.org (JSON-LD)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Structured data in JSON-LD format to help search engines understand your content better. Validate your JSON before saving.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id='schemaOrg'
              name='schemaOrg'
              value={formData.schemaOrg || ''}
              onChange={handleChange}
              rows={8}
              className={`${errors.schemaOrg || !isValidJson(formData.schemaOrg) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title"\n}'
              aria-describedby="schemaOrg-error schemaOrg-help"
            />
            {errors.schemaOrg && Array.isArray(errors.schemaOrg) && (
  <p id="schemaOrg-error" className='text-sm text-destructive'>{errors.schemaOrg[0]}</p>
)}
            {!isValidJson(formData.schemaOrg) && !errors.schemaOrg && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
            <p id="schemaOrg-help" className='text-sm text-muted-foreground'>Enter valid JSON-LD. Use online validators to check syntax.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor='industryData' className="flex items-center">
              Industry-Specific Data (JSON)
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button" className="ml-1 h-5 w-5">
                    <Info size={14} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Custom JSON data specific to the selected industry type. Structure depends on your application's needs.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id='industryData'
              name='industryData'
              value={formData.industryData || ''}
              onChange={handleChange}
              rows={8}
              className={`${errors.industryData || !isValidJson(formData.industryData) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='{\n  "productDetails": {\n    "sku": "ABC123",\n    "manufacturer": "Example Corp"\n  }\n}'
              aria-describedby="industryData-error industryData-help"
            />
            {errors.industryData && Array.isArray(errors.industryData) && (
  <p id="industryData-error" className='text-sm text-destructive'>{errors.industryData[0]}</p>
)}
            {!isValidJson(formData.industryData) && !errors.industryData && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
            <p id="industryData-help" className='text-sm text-muted-foreground'>Enter any industry-specific structured data as JSON.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className='flex justify-end space-x-4 border-t pt-6'>
        <Button
          type='button'
          variant="outline"
          onClick={() => router.push('/seo')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create SEO Entry' : 'Update SEO Entry'}
        </Button>
      </div>
    </form>
    // </TooltipProvider> // Temporarily removed for debugging
  );
}
