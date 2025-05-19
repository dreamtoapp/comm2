'use client'; // May become client for client-side interactions later

import { Badge } from '@/components/ui/badge';
import {
  DiscountType,
  PromotionType,
} from '@prisma/client';

import { PromotionListItem } from '../actions/getPromotions';
import PromotionsTableClientActions
  from './PromotionsTableClientActions'; // Import the actions component

interface PromotionsTableProps {
  promotions: PromotionListItem[];
}

// Helper to format dates (can be moved to a shared util)
const formatDate = (date: Date | null): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Helper to display discount
const formatDiscount = (promo: PromotionListItem): string => {
  if (promo.discountValue === null || promo.discountType === null) return 'N/A';
  if (promo.discountType === DiscountType.PERCENTAGE) { // Use direct enum
    return `${promo.discountValue}%`;
  }
  if (promo.discountType === DiscountType.FIXED_AMOUNT) { // Use direct enum
    return `${promo.discountValue.toLocaleString('ar-EG')} ر.س`;
  }
  return 'N/A';
};

// Helper to display promotion type
const formatPromotionType = (type: PromotionType): string => { // Use direct enum type
  switch (type) {
    case PromotionType.PERCENTAGE_PRODUCT: return 'خصم نسبة على منتجات';
    case PromotionType.FIXED_PRODUCT: return 'خصم مبلغ ثابت على منتجات';
    case PromotionType.PERCENTAGE_ORDER: return 'خصم نسبة على الطلب';
    case PromotionType.FIXED_ORDER: return 'خصم مبلغ ثابت على الطلب';
    case PromotionType.FREE_SHIPPING: return 'شحن مجاني';
    default:
      // Optional: Add exhaustive check for unhandled enum members
      // const _exhaustiveCheck: never = type;
      // return _exhaustiveCheck; 
      return String(type); // Fallback to string representation if new enum added
  }
};

export default function PromotionsTable({ promotions }: PromotionsTableProps) {
  return (
    <div className="w-full rounded-lg border bg-card shadow-sm">
      <table className="rtl w-full text-right text-sm table-auto">
        <thead className="bg-accent text-accent-foreground">          <tr>
          <th className="px-4 py-3">العنوان</th><th className="px-4 py-3">النوع</th><th className="px-4 py-3">الخصم</th><th className="px-4 py-3">المنتجات (عدد)</th><th className="px-4 py-3">تاريخ البدء</th><th className="px-4 py-3">تاريخ الانتهاء</th><th className="px-4 py-3 text-center">الحالة</th><th className="px-4 py-3 text-center">الإجراءات</th>
        </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
            <tr key={promo.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="px-4 py-2 font-medium">
                <span title={promo.title} className="block max-w-xs line-clamp-1">{promo.title}</span>
              </td>
              <td className="px-4 py-2">{formatPromotionType(promo.type)}</td>
              <td className="px-4 py-2">{formatDiscount(promo)}</td>{/* <td className="px-4 py-2">
                {promo.couponCode ? (
                  <Badge variant="outline">{promo.couponCode}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td> */} {/* Commented out */}
              <td className="px-4 py-2 text-center">{promo.productIds.length > 0 ? promo.productIds.length : '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap">{formatDate(promo.startDate)}</td>
              <td className="px-4 py-2 whitespace-nowrap">{formatDate(promo.endDate)}</td>
              <td className="px-4 py-2 text-center">
                <Badge variant={promo.active ? 'default' : 'destructive'} className={promo.active ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                  {promo.active ? 'فعال' : 'غير فعال'}
                </Badge>
              </td>
              <td className="px-4 py-2 text-center">
                <PromotionsTableClientActions
                  promotionId={promo.id}
                  promotionTitle={promo.title}
                  currentStatus={promo.active}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
