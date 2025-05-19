// Product SEO List Page
// Route: /dashboard/seo/product
// Shows all products with their SEO status per locale

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllProductsWithSeoStatus } from './actions/get-all-products-seo';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const LOCALES = [
  { code: 'ar-SA', label: 'العربية' },
  { code: 'en-US', label: 'English' },
];

export default async function ProductSeoListPage() {
  const products = await getAllProductsWithSeoStatus();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">إدارة SEO للمنتجات</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl bg-card shadow">
          <thead>
            <tr className="bg-muted text-foreground">
              <th className="p-3 text-right font-semibold">اسم المنتج</th>
              {LOCALES.map((locale) => (
                <th key={locale.code} className="p-3 text-center font-semibold">
                  {locale.label}
                </th>
              ))}
              <th className="p-3 text-center font-semibold">تعديل</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-b-0">
                <td className="p-3 font-medium text-right">{product.name}</td>
                {LOCALES.map((locale) => {
                  const status = product.seoStatus[locale.code];
                  return (
                    <td key={locale.code} className="p-3 text-center">
                      {status?.hasMetaTitle && status?.hasMetaDescription ? (
                        <span className="inline-flex items-center gap-1 text-success-foreground">
                          <CheckCircle className="w-5 h-5" /> مكتمل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-warning-foreground">
                          <AlertTriangle className="w-5 h-5" /> ناقص
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="p-3 text-center">
                  <Link href={`/dashboard/seo/product/${product.id}`}>
                    <Button variant="secondary">تعديل</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
