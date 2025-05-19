'use client';

import type React from 'react';
import { SocialSeoFormTooltips } from '@/app/seo/constant/social-tooltip-content';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
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
import { Trash2 } from 'lucide-react';

export type SocialSeoFormDataSubset = {
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImages: string[];
  twitterCardType: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImages: string[];
};

type SocialSeoFormFieldsProps = {
  formData: SocialSeoFormDataSubset;
  errors: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectValueChange: (name: keyof SocialSeoFormDataSubset, value: string) => void;
  handleArrayChange: (name: keyof Pick<SocialSeoFormDataSubset, 'openGraphImages' | 'twitterImages'>, value: string[]) => void;
  addToArray: (name: keyof Pick<SocialSeoFormDataSubset, 'openGraphImages' | 'twitterImages'>, inputId: string) => void;
  removeFromArray: (name: keyof Pick<SocialSeoFormDataSubset, 'openGraphImages' | 'twitterImages'>, index: number) => void;
};

export default function SocialSeoFormFields({
  formData,
  errors,
  handleChange,
  handleSelectValueChange,
  handleArrayChange,
  addToArray,
  removeFromArray,
}: SocialSeoFormFieldsProps) {

  return (
    <div className="space-y-6"> {/* Added a parent div with space-y-6 for consistent spacing between cards */}
      <Card>
        <CardHeader>
          <CardTitle>Open Graph (Facebook, LinkedIn, etc.)</CardTitle>
          <CardDescription>Settings for how content appears when shared on general social media platforms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='openGraphTitle'>Open Graph Title</Label>
              <InfoTooltip content={SocialSeoFormTooltips.openGraphTitle} />
            </div>
            <Input
              type='text'
              id='openGraphTitle'
              name='openGraphTitle'
              value={formData.openGraphTitle || ''}
              onChange={handleChange}
              className={`${errors?.openGraphTitle ? 'border-destructive' : ''}`}
              placeholder='Title for social sharing'
            />
            {errors?.openGraphTitle && <p className='text-sm text-destructive'>{errors.openGraphTitle[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='openGraphDescription'>Open Graph Description</Label>
              <InfoTooltip content={SocialSeoFormTooltips.openGraphDescription} />
            </div>
            <Textarea
              id='openGraphDescription'
              name='openGraphDescription'
              value={formData.openGraphDescription || ''}
              onChange={handleChange}
              rows={3}
              className={`${errors?.openGraphDescription ? 'border-destructive' : ''}`}
              placeholder='Description for social sharing'
            />
            {errors?.openGraphDescription && <p className='text-sm text-destructive'>{errors.openGraphDescription[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='openGraphImages'>Open Graph Images (URLs)</Label>
              <InfoTooltip content={SocialSeoFormTooltips.openGraphImages} />
            </div>
            {(formData.openGraphImages || []).map((url, index) => (
              <div key={`ogImage-${index}`} className="flex items-center space-x-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const newImages = [...(formData.openGraphImages || [])];
                    newImages[index] = e.target.value;
                    handleArrayChange('openGraphImages', newImages);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={`${(errors?.openGraphImages as string[] | undefined)?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('openGraphImages', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input type="url" id="newOpenGraphImage" placeholder="Add image URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('openGraphImages', 'newOpenGraphImage');
                  }
                }}
              />
              <Button type="button" onClick={() => addToArray('openGraphImages', 'newOpenGraphImage')}>Add Image</Button>
            </div>
            {errors?.openGraphImages && typeof errors.openGraphImages === 'string' && <p className='text-sm text-destructive'>{errors.openGraphImages}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twitter Specific Settings</CardTitle>
          <CardDescription>Customize how content appears when shared on Twitter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='twitterCardType'>Twitter Card Type</Label>
              <InfoTooltip content={SocialSeoFormTooltips.twitterCardType} />
            </div>
            <Select
              name="twitterCardType"
              value={formData.twitterCardType || 'none'}
              onValueChange={(value) => handleSelectValueChange('twitterCardType', value === 'none' ? '' : value)}
            >
              <SelectTrigger id="twitterCardType" className={`${errors?.twitterCardType ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>None (use Open Graph)</SelectItem>
                <SelectItem value='summary'>Summary</SelectItem>
                <SelectItem value='summary_large_image'>Summary with Large Image</SelectItem>
                <SelectItem value='app'>App</SelectItem>
                <SelectItem value='player'>Player</SelectItem>
              </SelectContent>
            </Select>
            {errors?.twitterCardType && <p className='text-sm text-destructive'>{errors.twitterCardType[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='twitterSite'>Twitter Site Handle</Label>
              <InfoTooltip content={SocialSeoFormTooltips.twitterSite} />
            </div>
            <Input type='text' id='twitterSite' name='twitterSite' value={formData.twitterSite || ''} onChange={handleChange} className={`${errors?.twitterSite ? 'border-destructive' : ''}`} placeholder='@username' />
            {errors?.twitterSite && <p className='text-sm text-destructive'>{errors.twitterSite[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='twitterCreator'>Twitter Creator Handle</Label>
              <InfoTooltip content={SocialSeoFormTooltips.twitterCreator} />
            </div>
            <Input type='text' id='twitterCreator' name='twitterCreator' value={formData.twitterCreator || ''} onChange={handleChange} className={`${errors?.twitterCreator ? 'border-destructive' : ''}`} placeholder='@username' />
            {errors?.twitterCreator && <p className='text-sm text-destructive'>{errors.twitterCreator[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='twitterTitle'>Twitter Title</Label>
              <InfoTooltip content={SocialSeoFormTooltips.twitterTitle} />
            </div>
            <Input type='text' id='twitterTitle' name='twitterTitle' value={formData.twitterTitle || ''} onChange={handleChange} className={`${errors?.twitterTitle ? 'border-destructive' : ''}`} placeholder='Title for Twitter sharing' />
            {errors?.twitterTitle && <p className='text-sm text-destructive'>{errors.twitterTitle[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='twitterDescription'>Twitter Description</Label>
              <InfoTooltip content={SocialSeoFormTooltips.twitterDescription} />
            </div>
            <Textarea id='twitterDescription' name='twitterDescription' value={formData.twitterDescription || ''} onChange={handleChange} rows={3} className={`${errors?.twitterDescription ? 'border-destructive' : ''}`} placeholder='Description for Twitter sharing' />
            {errors?.twitterDescription && <p className='text-sm text-destructive'>{errors.twitterDescription[0]}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='twitterImages'>Twitter Images (URLs)</Label>
              <InfoTooltip content={SocialSeoFormTooltips.twitterImages} />
            </div>
            {(formData.twitterImages || []).map((url, index) => (
              <div key={`twitterImage-${index}`} className="flex items-center space-x-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const newImages = [...(formData.twitterImages || [])];
                    newImages[index] = e.target.value;
                    handleArrayChange('twitterImages', newImages);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={`${(errors?.twitterImages as string[] | undefined)?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('twitterImages', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input type="url" id="newTwitterImage" placeholder="Add image URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('twitterImages', 'newTwitterImage');
                  }
                }}
              />
              <Button type="button" onClick={() => addToArray('twitterImages', 'newTwitterImage')}>Add Image</Button>
            </div>
            {errors?.twitterImages && typeof errors.twitterImages === 'string' && <p className='text-sm text-destructive'>{errors.twitterImages}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
