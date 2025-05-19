'use client';

import { X } from 'lucide-react'; // Updated icon [[10]]
import { useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Deslugify } from '@/utils/slug';

const ClearButton = ({ slugString }: { slugString?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = !!searchParams.toString();
  const filterCount = searchParams.size;

  const handleClear = () => {
    if (hasFilters) {
      router.push(window.location.pathname, { scroll: false }); // Smooth navigation [[5]]
    }
  };

  if (!hasFilters) return null;

  return (
    <Card className='border bg-background p-3'>
      <CardContent
        className='flex flex-col items-center justify-between gap-4 p-0 md:flex-row'
        id='filter-display'
      >
        {/* Filter display section */}
        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='secondary' className='px-3 py-1'>
            {filterCount} فلتر نشط{filterCount > 1 && 'ة'}
          </Badge>
          <span className='max-w-[200px] truncate text-sm text-muted-foreground'>
            {Deslugify(slugString || '')
              .replace(/-/g, ' ')
              .replace(/^\w/, (c) => c.toUpperCase())}
          </span>
        </div>

        {/* Clear button with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClear}
              variant='outline'
              className='group transition-all hover:bg-destructive hover:text-white'
              size='sm'
            >
              <X className='mr-2 h-4 w-4 transition-transform group-hover:scale-110' />
              <span className='hidden md:inline'>مسح جميع الفلاتر</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>إزالة جميع الفلاتر النشطة ({filterCount})</p>
          </TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default ClearButton;
