'use client';

import { usePathname } from 'next/navigation';

import Link from '@/components/link'; // Reusing the custom Link component

// Define the CategoryLink type
interface CategoryLinkData {
  name: string;
  href: string;
  highlight?: boolean; // Optional property for special styling
  // Icons can be added later if desired for categories
}

// Placeholder categories
const categoryLinksData: CategoryLinkData[] = [
  { name: 'ملابس رجالية', href: '/category/mens-fashion' },
  { name: 'ملابس نسائية', href: '/category/womens-fashion' },
  { name: 'أطفال', href: '/category/kids' },
  { name: 'إلكترونيات', href: '/category/electronics' },
  { name: 'مستلزمات المنزل', href: '/category/home-goods' },
  { name: 'الجمال والعناية', href: '/category/beauty-care' },
  { name: 'عروض', href: '/category/offers', highlight: true }, // Example of a highlighted link
];

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6 lg:gap-x-8' aria-label='Product categories'>
      {categoryLinksData.map((link) => {
        const isActive = pathname.startsWith(link.href); // Use startsWith for category pages

        return (
          <Link
            key={link.name}
            href={link.href}
            aria-label={link.name}
            className={`
              whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
              ${link.highlight // Special style for highlighted links like 'Offers'
                ? 'text-destructive hover:bg-destructive/10 dark:text-red-400 dark:hover:bg-red-900/20'
                : isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary dark:text-primary-foreground' // Active category link
                  : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground dark:text-foreground/60 dark:hover:bg-white/5 dark:hover:text-foreground/80'
              }
            `}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
