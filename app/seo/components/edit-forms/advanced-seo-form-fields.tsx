'use client';

import type React from 'react';
import { useState } from 'react'; // Import useState
import { AdvancedSeoFormTooltips, SchemaOrgTemplates, IndustryDataTemplates } from '@/app/seo/constant/advanced-tooltip-content';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Button } from '@/components/ui/button'; // Import Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select
import { Textarea } from '@/components/ui/textarea';
import type { EntityType, IndustryType } from '@prisma/client'; // Import Enums

export type AdvancedSeoFormDataSubset = {
  schemaOrg: string;
  industryData: string;
};

type AdvancedSeoFormFieldsProps = {
  formData: AdvancedSeoFormDataSubset;
  errors: Record<string, string[] | string | undefined>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  entityType?: EntityType; // Add entityType
  industryType?: IndustryType; // Add industryType
};

export default function AdvancedSeoFormFields({
  formData,
  errors,
  handleChange,
  entityType,
  industryType,
}: AdvancedSeoFormFieldsProps) {
  const [selectedSchemaTemplate, setSelectedSchemaTemplate] = useState('');
  const [selectedIndustryTemplate, setSelectedIndustryTemplate] = useState('');

  const handleTemplateSelect = (fieldName: 'schemaOrg' | 'industryData', value: string) => {
    handleChange({
      target: { name: fieldName, value },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    if (fieldName === 'schemaOrg') setSelectedSchemaTemplate(value);
    if (fieldName === 'industryData') setSelectedIndustryTemplate(value);
  };

  const currentSchemaTemplates = entityType ? (SchemaOrgTemplates[entityType] || SchemaOrgTemplates['DEFAULT']) : SchemaOrgTemplates['DEFAULT'];
  const currentIndustryTemplates = industryType && IndustryDataTemplates[industryType] ? IndustryDataTemplates[industryType] : [];


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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schema.org Markup (JSON-LD)</CardTitle>
          <CardDescription>Provide structured data to help search engines understand your content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='schemaOrg'>Schema.org JSON-LD</Label>
              <InfoTooltip content={AdvancedSeoFormTooltips.schemaOrg} />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Select value={selectedSchemaTemplate} onValueChange={(value) => {
                if (value) handleTemplateSelect('schemaOrg', value);
                setSelectedSchemaTemplate(value);
              }}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a Schema.org template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {currentSchemaTemplates.map((template: { label: string; value: string }) => (
                    <SelectItem key={template.label} value={template.value}>{template.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              id='schemaOrg'
              name='schemaOrg'
              value={formData.schemaOrg || ''}
              onChange={handleChange}
              rows={10}
              className={`${errors.schemaOrg || !isValidJson(formData.schemaOrg) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title"\n}'
            />
            {errors.schemaOrg && <p className='text-sm text-destructive'>{Array.isArray(errors.schemaOrg) ? errors.schemaOrg[0] : errors.schemaOrg}</p>}
            {!isValidJson(formData.schemaOrg) && !errors.schemaOrg && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Industry-Specific Data (JSON)</CardTitle>
          <CardDescription>Custom JSON data relevant to the page's industry type.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor='industryData'>Industry Data JSON</Label>
              <InfoTooltip content={AdvancedSeoFormTooltips.industryData} />
            </div>
            {currentIndustryTemplates.length > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <Select value={selectedIndustryTemplate} onValueChange={(value) => {
                  if (value) handleTemplateSelect('industryData', value);
                  setSelectedIndustryTemplate(value);
                }}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select an Industry Data template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentIndustryTemplates.map((template: { label: string; value: string }) => (
                      <SelectItem key={template.label} value={template.value}>{template.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Textarea
              id='industryData'
              name='industryData'
              value={formData.industryData || ''}
              onChange={handleChange}
              rows={10}
              className={`${errors.industryData || !isValidJson(formData.industryData) ? 'border-destructive' : ''} font-mono text-sm`}
              placeholder='{\n  "productDetails": {\n    "sku": "ABC123",\n    "manufacturer": "Example Corp"\n  }\n}'
            />
            {errors.industryData && <p className='text-sm text-destructive'>{Array.isArray(errors.industryData) ? errors.industryData[0] : errors.industryData}</p>}
            {!isValidJson(formData.industryData) && !errors.industryData && (<p className='text-sm text-destructive'>Invalid JSON format.</p>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
