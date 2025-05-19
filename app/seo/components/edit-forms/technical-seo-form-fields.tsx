'use client';

import type React from 'react';
import { useState } from 'react'; // Import useState for local state if needed for Select
import { TechnicalSeoFormTooltips, SecurityHeaderTemplates, HttpEquivTemplates } from '@/app/seo/constant/technical-tooltip-content';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Import Select components
import { Trash2 } from 'lucide-react';

export type TechnicalSeoFormDataSubset = {
  securityHeaders: string[];
  preloadAssets: string[];
  httpEquiv: string[];
};

type TechnicalSeoFormFieldsProps = {
  formData: TechnicalSeoFormDataSubset;
  errors: Record<string, any>;
  handleArrayChange: (name: keyof TechnicalSeoFormDataSubset, value: string[]) => void;
  addToArray: (name: keyof TechnicalSeoFormDataSubset, inputId: string, value?: string) => void; // Modified to accept value
  removeFromArray: (name: keyof TechnicalSeoFormDataSubset, index: number) => void;
};

export default function TechnicalSeoFormFields({
  formData,
  errors,
  handleArrayChange,
  addToArray,
  removeFromArray,
}: TechnicalSeoFormFieldsProps) {
  // Local state for template select inputs
  const [selectedSecurityHeaderTemplate, setSelectedSecurityHeaderTemplate] = useState('');
  const [selectedHttpEquivTemplate, setSelectedHttpEquivTemplate] = useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Headers</CardTitle>
          <CardDescription>Enhance your site's security with these HTTP headers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='securityHeaders-group'>Header Values</Label>
              <InfoTooltip content={TechnicalSeoFormTooltips.securityHeaders} />
            </div>
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
                  className={`${(errors.securityHeaders as string[] | undefined)?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('securityHeaders', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Select value={selectedSecurityHeaderTemplate} onValueChange={(value) => {
                setSelectedSecurityHeaderTemplate(value);
                const inputEl = document.getElementById('newSecurityHeader') as HTMLInputElement;
                if (inputEl && value) inputEl.value = value;
              }}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {SecurityHeaderTemplates.map(template => (
                    <SelectItem key={template.value} value={template.value}>{template.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                id="newSecurityHeader"
                placeholder="Or type custom header"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('securityHeaders', 'newSecurityHeader');
                    setSelectedSecurityHeaderTemplate(''); // Reset select
                  }
                }}
              />
              <Button type="button" onClick={() => {
                addToArray('securityHeaders', 'newSecurityHeader');
                setSelectedSecurityHeaderTemplate(''); // Reset select
              }}>
                Add Header
              </Button>
            </div>
            {errors.securityHeaders && typeof errors.securityHeaders === 'string' && <p className='text-sm text-destructive'>{errors.securityHeaders}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preload Assets</CardTitle>
          <CardDescription>Specify critical assets to load early for faster page rendering.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='preloadAssets-group'>Asset URLs</Label>
              <InfoTooltip content={TechnicalSeoFormTooltips.preloadAssets} />
            </div>
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
                  className={`${(errors.preloadAssets as string[] | undefined)?.[index] ? 'border-destructive' : ''}`}
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
                    addToArray('preloadAssets', 'newPreloadAsset');
                  }
                }}
              />
              <Button type="button" onClick={() => addToArray('preloadAssets', 'newPreloadAsset')}>
                Add Asset
              </Button>
            </div>
            {errors.preloadAssets && typeof errors.preloadAssets === 'string' && <p className='text-sm text-destructive'>{errors.preloadAssets}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>HTTP-Equiv Tags</CardTitle>
          <CardDescription>Meta tags that simulate HTTP headers. Use with caution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='httpEquiv-group'>Tag Values</Label>
              <InfoTooltip content={TechnicalSeoFormTooltips.httpEquiv} />
            </div>
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
                  className={`${(errors.httpEquiv as string[] | undefined)?.[index] ? 'border-destructive' : ''}`}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeFromArray('httpEquiv', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Select value={selectedHttpEquivTemplate} onValueChange={(value) => {
                setSelectedHttpEquivTemplate(value);
                const inputEl = document.getElementById('newHttpEquiv') as HTMLInputElement;
                if (inputEl && value) inputEl.value = value;
              }}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {HttpEquivTemplates.map(template => (
                    <SelectItem key={template.value} value={template.value}>{template.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                id="newHttpEquiv"
                placeholder="Or type custom tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    addToArray('httpEquiv', 'newHttpEquiv');
                    setSelectedHttpEquivTemplate(''); // Reset select
                  }
                }}
              />
              <Button type="button" onClick={() => {
                addToArray('httpEquiv', 'newHttpEquiv');
                setSelectedHttpEquivTemplate(''); // Reset select
              }}>
                Add Tag
              </Button>
            </div>
            {errors.httpEquiv && typeof errors.httpEquiv === 'string' && <p className='text-sm text-destructive'>{errors.httpEquiv}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
