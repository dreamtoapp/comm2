'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  getPromotionAnalytics,
  PromotionAnalyticsData,
} from '../actions/get-promotion-analytics';
import { formatCurrency } from '@/lib/formatCurrency'; // Assuming you have a currency formatter

interface PromotionAnalyticsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  promotionId: string | null;
  promotionTitle: string | null;
}

export default function PromotionAnalyticsModal({
  isOpen,
  onOpenChange,
  promotionId,
  promotionTitle,
}: PromotionAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<PromotionAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && promotionId) {
      const fetchAnalytics = async () => {
        setIsLoading(true);
        setError(null);
        setAnalytics(null);
        try {
          const data = await getPromotionAnalytics(promotionId);
          if (data) {
            setAnalytics(data);
          } else {
            setError('لم يتم العثور على بيانات تحليل لهذا العرض.');
          }
        } catch (e) {
          console.error('Failed to fetch promotion analytics:', e);
          setError('فشل تحميل بيانات التحليل.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [isOpen, promotionId]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when closing
    setAnalytics(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تحليلات العرض: {promotionTitle || '...'}</DialogTitle>
          {promotionId && <DialogDescription>معرف العرض: {promotionId}</DialogDescription>}
        </DialogHeader>
        <div className="py-4 space-y-3">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">جارٍ تحميل التحليلات...</p>
            </div>
          )}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          {analytics && !isLoading && !error && (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>عدد مرات الاستخدام:</span>
                <span className="font-semibold">{analytics.timesUsed.toLocaleString('ar-EG')}</span>
              </li>
              <li className="flex justify-between">
                <span>إجمالي المبيعات الناتجة:</span>
                <span className="font-semibold">{formatCurrency(analytics.totalSalesGenerated)}</span>
              </li>
              <li className="flex justify-between">
                <span>متوسط قيمة الطلب (مع العرض):</span>
                <span className="font-semibold">{formatCurrency(analytics.averageOrderValue)}</span>
              </li>
              {/* Add more analytics data here as needed */}
            </ul>
          )}
          {!isLoading && !analytics && !error && promotionId && (
            <p className="text-sm text-muted-foreground text-center py-4">لا توجد بيانات تحليل متاحة لهذا العرض.</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleClose}>
              إغلاق
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
