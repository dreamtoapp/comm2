'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { PromotionReportKpi, PromotionReportDataItem, PromotionUsageChartItem } from '../action/getPromotionsReportData';
import { PromotionType, DiscountType } from '@prisma/client'; // For formatting type names

interface PromotionsReportClientProps {
  kpis: PromotionReportKpi[];
  promotions: PromotionReportDataItem[];
  topUsedPromotionsChart: PromotionUsageChartItem[];
  usageByTypeChart: PromotionUsageChartItem[];
  initialFrom?: string;
  initialTo?: string;
  error?: string;
}

// Helper to format promotion type names for display
function formatPromotionType(type: PromotionType | string): string {
  switch (type) {
    case PromotionType.PERCENTAGE_PRODUCT: return 'خصم نسبة على منتجات';
    case PromotionType.FIXED_PRODUCT: return 'خصم مبلغ ثابت على منتجات';
    case PromotionType.PERCENTAGE_ORDER: return 'خصم نسبة على الطلب';
    case PromotionType.FIXED_ORDER: return 'خصم مبلغ ثابت على الطلب';
    case PromotionType.FREE_SHIPPING: return 'شحن مجاني';
    default: return String(type);
  }
}

export default function PromotionsReportClient({
  kpis,
  promotions,
  topUsedPromotionsChart,
  usageByTypeChart,
  initialFrom,
  initialTo,
  error,
}: PromotionsReportClientProps) {
  const [from, setFrom] = useState(initialFrom || '');
  const [to, setTo] = useState(initialTo || '');

  const [barChartColor, setBarChartColor] = useState('#8884d8');
  const [pieChartColors, setPieChartColors] = useState<string[]>(['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']);

  function getResolvedColor(variableName: string, fallbackColor: string): string {
    if (typeof window === 'undefined') return fallbackColor;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return fallbackColor;
  }

  useEffect(() => {
    setBarChartColor(getResolvedColor('--chart-1', '#8884d8'));
    const resolvedPieColors = [
      getResolvedColor('--chart-1', '#0088FE'),
      getResolvedColor('--chart-2', '#00C49F'),
      getResolvedColor('--chart-3', '#FFBB28'),
      getResolvedColor('--chart-4', '#FF8042'),
      getResolvedColor('--chart-5', '#FFBB28'), // Re-using chart-3 for 5th color as an example
    ].filter(Boolean);
    if (resolvedPieColors.length > 0) setPieChartColors(resolvedPieColors);
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.search = params.toString();
  };

  if (error) {
    return <Card><CardContent className="py-10 text-center text-destructive-foreground">{error}</CardContent></Card>;
  }

  return (
    <div className='space-y-8'>
      {/* Filter Panel */}
      <Card>
        <CardContent className='flex flex-col items-end gap-4 py-4 md:flex-row'>
          <div>
            <label className='mb-1 block text-sm font-medium text-card-foreground'>من تاريخ</label>
            <Input type='date' value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-card-foreground'>إلى تاريخ</label>
            <Input type='date' value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button className='mt-4 md:mt-0' onClick={handleFilter}>
            تطبيق الفلتر
          </Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      {kpis.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {kpis.map((kpi) => (
            <Card key={kpi.label} className='text-center bg-card shadow'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-card-foreground'>{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-bold text-primary'>{String(kpi.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-4 text-center text-muted-foreground">لا توجد بيانات KPI للعرض.</CardContent></Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle className="text-xl text-card-foreground">أكثر العروض استخدامًا</CardTitle></CardHeader>
          <CardContent>
            {topUsedPromotionsChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topUsedPromotionsChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} interval={0} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" name="مرات الاستخدام" fill={barChartColor} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-10">لا توجد بيانات لعرضها.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xl text-card-foreground">استخدام العروض حسب النوع</CardTitle></CardHeader>
          <CardContent>
            {usageByTypeChart.filter(item => item.usage > 0).length > 0 ? ( // Filter out types with 0 usage for pie chart
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={usageByTypeChart.filter(item => item.usage > 0)} dataKey="usage" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {usageByTypeChart.filter(item => item.usage > 0).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, formatPromotionType(String(name))]} /> {/* Ensure name is string */}
                  <Legend formatter={(value) => formatPromotionType(String(value))} /> {/* Ensure value is string */}
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-10">لا توجد بيانات لعرضها.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card>
        <CardHeader><CardTitle className="text-xl text-card-foreground">قائمة العروض</CardTitle></CardHeader>
        <CardContent className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">قيمة الخصم</TableHead>
                <TableHead className="text-right">تاريخ البدء</TableHead>
                <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">مرات الاستخدام</TableHead>
                <TableHead className="text-right">عدد المنتجات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length > 0 ? promotions.map((promo) => (
                <TableRow key={promo.id}><TableCell className="font-medium">{promo.title}</TableCell><TableCell>{formatPromotionType(promo.type)}</TableCell><TableCell>{promo.discountValue !== null ? `${promo.discountValue}${promo.discountType === DiscountType.PERCENTAGE ? '%' : ' ر.س'}` : '-'}</TableCell><TableCell>{promo.startDate ? new Date(promo.startDate).toLocaleDateString('ar-EG') : '-'}</TableCell><TableCell>{promo.endDate ? new Date(promo.endDate).toLocaleDateString('ar-EG') : '-'}</TableCell><TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${promo.active ? 'bg-success-soft-bg text-success-foreground' : 'bg-destructive-soft-bg text-destructive-foreground'}`}>{promo.active ? 'نشط' : 'غير نشط'}</span></TableCell><TableCell>{"N/A"}</TableCell><TableCell>{promo.productCount > 0 ? promo.productCount : '-'}</TableCell></TableRow>
              )) : (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">لا توجد عروض لعرضها.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
