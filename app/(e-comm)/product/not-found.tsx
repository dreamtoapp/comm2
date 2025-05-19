import Link from 'next/link';
import { PackageX } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className='container py-16'>
      <div className='mx-auto max-w-md text-center'>
        <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/30'>
          <PackageX className={iconVariants({ size: 'xl', className: 'text-muted-foreground' })} /> {/* Use direct import + CVA (adjust size if needed) */}
        </div>

        <h1 className='mb-4 text-2xl font-bold'>المنتج غير موجود</h1>

        <p className='mb-8 text-muted-foreground'>
          عذراً، المنتج الذي تبحث عنه غير موجود أو ربما تمت إزالته.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild>
            <Link href='/'>العودة للصفحة الرئيسية</Link>
          </Button>

          <Button variant='outline' asChild>
            <Link href='/products'>تصفح المنتجات</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
