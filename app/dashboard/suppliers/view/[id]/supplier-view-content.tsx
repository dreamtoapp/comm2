'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Supplier } from '@prisma/client'; // Import Prisma type
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin } from 'lucide-react';


// Define a more specific type for the supplier prop, including relations
interface ProductSample {
  id: string;
  name: string;
  imageUrl?: string | null;
}
interface SupplierForView extends Omit<Supplier, 'products' | '_count'> {
  id: string;
  products: ProductSample[]; // Sample of products
  productCount: number;
}

interface SupplierViewContentProps {
  supplier: SupplierForView;
}

const formatDate = (dateString?: string | Date | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function SupplierViewContent({ supplier }: SupplierViewContentProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3 items-start">
      {/* Left Column: Supplier Info Card */}
      <Card className="lg:col-span-1 shadow-lg">
        <CardHeader className="items-center">
          {supplier.logo && (
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary mb-4">
              <Image src={supplier.logo} alt={`${supplier.name} logo`} fill className="object-cover" />
            </div>
          )}
          <CardTitle className="text-2xl text-center text-foreground">{supplier.name}</CardTitle>
          <Badge variant={supplier.type === 'company' ? 'default' : 'secondary'} className="mt-1">
            {supplier.type === 'company' ? 'شركة' : supplier.type === 'individual' ? 'فرد' : supplier.type || 'غير محدد'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {supplier.email && (
            <InfoRow icon={<Mail className="w-4 h-4 text-muted-foreground" />} label="البريد الإلكتروني" value={supplier.email} isLink={`mailto:${supplier.email}`} />
          )}
          {supplier.phone && (
            <InfoRow icon={<Phone className="w-4 h-4 text-muted-foreground" />} label="الهاتف" value={supplier.phone} isLink={`tel:${supplier.phone}`} />
          )}
          {supplier.address && (
            <InfoRow icon={<MapPin className="w-4 h-4 text-muted-foreground" />} label="العنوان" value={supplier.address} />
          )}
          <Separator />
          <InfoRow icon={<span className="w-4 h-4 text-muted-foreground">📅</span>} label="تاريخ الإنشاء" value={formatDate(supplier.createdAt)} />
          <InfoRow icon={<span className="w-4 h-4 text-muted-foreground">🕒</span>} label="آخر تحديث" value={formatDate(supplier.updatedAt)} />
        </CardContent>
      </Card>

      {/* Right Column: Associated Products */}
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl text-primary">
            <span>المنتجات المرتبطة ({supplier.productCount})</span>
            <Link href={`/dashboard/products?supplierId=${supplier.id}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              عرض كل المنتجات <span className="w-3 h-3">🔗</span>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supplier.products && supplier.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {supplier.products.map((product) => (
                <Link key={product.id} href={`/dashboard/products/view/${product.id}`} className="group block">
                  <Card className="overflow-hidden transition-all hover:shadow-xl">
                    <div className="aspect-square relative bg-muted">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <span style={{ fontSize: 32 }}>📦</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary" title={product.name}>
                        {product.name}
                      </h4>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">لا توجد منتجات مرتبطة بهذا المورد حاليًا.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, icon, isLink }: { label: string; value: string; icon?: React.ReactNode; isLink?: string }) {
  return (
    <div className="flex items-start">
      {icon && <span className="mr-2 rtl:ml-2 rtl:mr-0 mt-0.5">{icon}</span>}
      <strong className="w-28 text-muted-foreground shrink-0">{label}:</strong>
      {isLink ? (
        <a href={isLink} className="text-primary hover:underline break-all" target="_blank" rel="noopener noreferrer">{value}</a>
      ) : (
        <span className="text-foreground break-all">{value}</span>
      )}
    </div>
  );
}
