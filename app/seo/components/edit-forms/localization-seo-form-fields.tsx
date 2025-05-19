'use client';

import type React from 'react';
import { Trash2 } from 'lucide-react';
import { LocalizationSeoFormTooltips } from '@/app/seo/constant/localization-tooltip-content';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Tooltip components removed as InfoTooltip is used

export type LocalizationSeoFormDataSubset = {
  defaultLanguage: string;
  supportedLanguages: string[];
  hreflang: string; // Expecting stringified JSON
};

type LocalizationSeoFormFieldsProps = {
  formData: LocalizationSeoFormDataSubset;
  errors: Record<string, string[] | string | undefined>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleArrayChange: (name: keyof Pick<LocalizationSeoFormDataSubset, 'supportedLanguages'>, value: string[]) => void;
  addToArray: (name: keyof Pick<LocalizationSeoFormDataSubset, 'supportedLanguages'>, inputId: string) => void;
  removeFromArray: (name: keyof Pick<LocalizationSeoFormDataSubset, 'supportedLanguages'>, index: number) => void;
};

export default function LocalizationSeoFormFields({
  formData,
  errors,
  handleChange,
  handleArrayChange,
  addToArray,
  removeFromArray,
}: LocalizationSeoFormFieldsProps) {

  const isValidJson = (str: string | null | undefined): boolean => {
    if (str === null || str === undefined || str.trim() === '') return true;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }; // Ensured semicolon

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Language Settings</CardTitle>
          <CardDescription>Configure default and supported languages for this content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='defaultLanguage'>Default Language</Label>
              <InfoTooltip content={LocalizationSeoFormTooltips.defaultLanguage} />
            </div>
            <Input
              type='text'
              id='defaultLanguage'
              name='defaultLanguage'
              value={formData.defaultLanguage}
              onChange={handleChange}
              className={`${errors.defaultLanguage ? 'border-destructive' : ''}`}
              placeholder='e.g., ar-SA'
            />
            {errors.defaultLanguage && <p className='text-sm text-destructive'>{Array.isArray(errors.defaultLanguage) ? errors.defaultLanguage[0] : errors.defaultLanguage}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='supportedLanguages-group'>Supported Languages</Label>
              <InfoTooltip content={LocalizationSeoFormTooltips.supportedLanguages} />
            </div>
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
                  className={`${(errors.supportedLanguages as string[] | undefined)?.[index] ? 'border-destructive' : ''}`}
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
                    addToArray('supportedLanguages', 'newSupportedLanguage');
                  }
                }}
              />
              <Button type="button" onClick={() => addToArray('supportedLanguages', 'newSupportedLanguage')}>
                Add Language
              </Button>
            </div>
            {errors.supportedLanguages && (
              <p className='text-sm text-destructive'>
                {Array.isArray(errors.supportedLanguages) ? errors.supportedLanguages.join(', ') : errors.supportedLanguages}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hreflang Configuration</CardTitle>
          <CardDescription>Define alternate language versions for search engines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='hreflang'>Hreflang Links (JSON)</Label>
              <InfoTooltip content={LocalizationSeoFormTooltips.hreflang} />
            </div>
            <Textarea
              id='hreflang'
              name='hreflang'
              value={formData.hreflang || ''}
              onChange={handleChange}
              rows={5}
              className={`${errors.hreflang || !isValidJson(formData.hreflang) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='{"en-US": "https://example.com/en/my-page", "es-ES": "https://example.com/es/mi-pagina"}'
            />
            {errors.hreflang && <p className='text-sm text-destructive'>{Array.isArray(errors.hreflang) ? errors.hreflang[0] : errors.hreflang}</p>}
            {!isValidJson(formData.hreflang) && !errors.hreflang && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
