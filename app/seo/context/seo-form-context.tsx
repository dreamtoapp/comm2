// app/seo/context/seo-form-context.tsx
'use client';

import { EntityType, IndustryType } from '@prisma/client'; // Import as values
import type React from 'react';
import { createContext, useContext, useState } from 'react';

export type SeoFormDataType = {
  entityId: string;
  metaTitle: string;
  metaDescription: string;
  entityType: EntityType;
  industryType: IndustryType;
  canonicalUrl?: string;
};

type SeoFormContextType = {
  formData: SeoFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<SeoFormDataType>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: keyof SeoFormDataType, value: string) => void;
};

const SeoFormContext = createContext<SeoFormContextType | undefined>(undefined);

export const SeoFormProvider: React.FC<{ children: React.ReactNode; initialData?: Partial<SeoFormDataType> }> = ({ children, initialData }) => {
  const [formData, setFormData] = useState<SeoFormDataType>({
    entityId: initialData?.entityId || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    entityType: initialData?.entityType || EntityType.PAGE,
    industryType: initialData?.industryType || IndustryType.OTHER,
    canonicalUrl: initialData?.canonicalUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof SeoFormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any })); // Cast to any for enum compatibility
  };

  return (
    <SeoFormContext.Provider value={{ formData, setFormData, handleChange, handleSelectChange }}>
      {children}
    </SeoFormContext.Provider>
  );
};

export const useSeoForm = () => {
  const context = useContext(SeoFormContext);
  if (context === undefined) {
    throw new Error('useSeoForm must be used within a SeoFormProvider');
  }
  return context;
};
