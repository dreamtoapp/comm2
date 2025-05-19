'use client';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { iconVariants } from '@/lib/utils';

export default function SearchBar() {
  return (
    <form
      className='relative flex w-full items-center'
      onSubmit={(e) => e.preventDefault()} // Prevent default form submission
    >
      <Input
        type='search'
        placeholder='ابحث عن المنتجات...'
        className='h-10 w-full rounded-lg border-border bg-muted/40 pl-4 pr-12 text-sm focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary'
        aria-label='Search products'
      />
      <Button
        type='submit'
        variant='ghost'
        size='icon'
        className='absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-md text-muted-foreground hover:text-primary'
        aria-label='Submit search'
      >
        <Search className={iconVariants({ size: 'sm' })} />
      </Button>
    </form>
  );
}
