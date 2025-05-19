// Promotion SEO List Page
// Route: /dashboard/seo/promotion
// Shows all promotions with their SEO status per locale

import React from 'react';
import PromotionSeoTable from './components/PromotionSeoTable';
import { getAllPromotionsWithSeoStatus } from './actions/get-all-promotions-seo';

export default async function PromotionSeoListPage() {
  const promotions = await getAllPromotionsWithSeoStatus();
  console.log(promotions);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">إدارة SEO للعروض</h1>
      <PromotionSeoTable promotions={promotions} />
    </div>
  );
}
