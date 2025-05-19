'use client';
import {
  Info,
  Phone,
  Store,
} from 'lucide-react'; // Import icons directly
import { usePathname } from 'next/navigation';

import Link from '@/components/link';
import { iconVariants } from '@/lib/utils'; // Correct import path for CVA variants

// Define the NavLink type
interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode; // Keep as React.ReactNode for simplicity
}

export default function NavLinks() {
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    {
      name: 'المتجر',
      href: '/',
      icon: <Store className={iconVariants({ size: 'sm' })} />, // Use direct import + CVA
    },
    {
      name: 'من نحن',
      href: '/about',
      icon: <Info className={iconVariants({ size: 'sm' })} />, // Use direct import + CVA
    },
    {
      name: 'تواصل معنا',
      href: '/contact',
      icon: <Phone className={iconVariants({ size: 'sm' })} />, // Use direct import + CVA
    },
  ];

  return (
    <nav className='flex flex-col gap-2 md:flex-row md:gap-4'>
      {navLinks.map((link, index) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={index}
            href={link.href}
            aria-label={link.name}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-300 ${isActive // Changed py-1 to py-2
              ? 'bg-green-500 text-white' // Active link styles
              : 'text-foreground hover:bg-primary/10 hover:text-primary'
              }`}
          >
            {/* Apply white color to the icon when active */}
            <span
              className={isActive ? 'text-white' : 'text-primary'} // Conditionally apply text color
            >
              {link.icon}
            </span>
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
