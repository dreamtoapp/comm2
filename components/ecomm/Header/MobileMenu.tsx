'use client';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react'; // Import directly
import Image from 'next/image';

import Link from '@/components/link';
import { Separator } from '@/components/ui/separator'; // For visual separation
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
// Removed Icon import: import { Icon } from '@/components/icons';
import { iconVariants } from '@/lib/utils'; // Correct import path for CVA variants

// import NavLinks from './NavLinks'; // Old NavLinks - will be replaced
import CategoryNav from './CategoryNav'; // New category navigation
import SearchBar from './SearchBar'; // New search bar

// Define general links for the mobile menu
const generalMobileLinks = [
  { name: 'من نحن', href: '/about' },
  { name: 'تواصل معنا', href: '/contact' },
  { name: 'سياسة الخصوصية', href: '/privacy-policy' },
  { name: 'الشروط والأحكام', href: '/terms-conditions' },
];

export default function MobileMenu() {
  return (
    <Sheet>
      {/* Menu Trigger Button */}
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label='Open side menu'
          className='rounded-lg p-2 transition-all hover:bg-muted/50 md:hidden' // Changed hover effect
        >
          <Menu className={iconVariants({ size: 'md', variant: 'default' })} /> {/* Use direct import + CVA, changed color to default variant */}
        </motion.button>
      </SheetTrigger>

      {/* Menu Content */}
      <SheetContent
        side='right'
        className='flex w-full max-w-xs flex-col border-l bg-background/95 p-0 backdrop-blur-md sm:max-w-sm' // Adjusted width and padding
      >
        {/* Header of the Sheet: Logo and Title */}
        <div className='flex items-center justify-between border-b p-4'>
          <Link href='/' aria-label='Home page' className='flex items-center gap-2'>
            <Image src='/assets/logo.png' alt='Company Logo' width={32} height={32} className='h-8 w-8' />
          </Link>
          <SheetTitle>
            <span className='text-lg font-semibold text-primary'>القائمة</span>
          </SheetTitle>
          {/* SheetClose is usually part of SheetContent by default in shadcn/ui, if not, it can be added */}
        </div>

        {/* Scrollable Content Area */}
        <div className='flex-1 overflow-y-auto p-4'>
          {/* Search Bar */}
          <div className='mb-6'>
            <SearchBar />
          </div>

          {/* Category Navigation */}
          <div className='mb-6'>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>الأقسام</h3>
            <CategoryNav /> {/* CategoryNav will handle its own layout */}
          </div>

          <Separator className='my-4' />

          {/* General Links */}
          <div>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>روابط مفيدة</h3>
            <nav className='flex flex-col gap-1'>
              {generalMobileLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className='rounded-md px-3 py-2.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-foreground'
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
