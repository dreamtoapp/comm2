'use client';

import {
  ReactNode,
  useState,
} from 'react';

import {
  BarChart3,
  FileText,
  BookOpenText, // Added for SEO Guides
  Globe as LocalizationIcon,
  LayoutList,
  Palette,
  PlusSquare,
  Share2,
  ShoppingBag,
  Tag,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Define types for menu items
type SubMenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string; // For top-level links
  children?: SubMenuItem[]; // For accordion children
};

export default function SeoLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [openAccordionId, setOpenAccordionId] = useState<string | undefined>(
    // Keep Page SEO open if any of its children or sub-children are active
    pathname.startsWith('/seo') ? 'page-seo-main' : undefined
  );

  const menuItems: MenuItem[] = [
    {
      id: 'page-seo-main',
      label: 'Page SEO',
      icon: FileText,
      children: [ // These are the direct children shown in your screenshot
        { href: '/seo', label: 'SEO Page Table', icon: LayoutList },
        { href: '/seo/create', label: 'New Page SEO', icon: PlusSquare },

        { href: '/seo/social', label: 'Social Media', icon: Share2 },
        { href: '/seo/technical', label: 'Technical', icon: Wrench },
        { href: '/seo/localization', label: 'Localization', icon: LocalizationIcon },
        { href: '/seo/advanced', label: 'Advanced', icon: Palette },
      ],
    },
    {
      id: 'seo-guides',
      label: 'SEO Guides',
      icon: BookOpenText, // Changed icon for SEO Guides
      children: [
        { href: '/seo/documentation/en', label: 'Documentation (EN)', icon: FileText },
        { href: '/seo/documentation/ar', label: 'التوثيق (AR)', icon: FileText },
      ]
    },
    { id: 'product-seo', href: '/seo/products', label: 'Product SEO', icon: ShoppingBag },
    { id: 'category-seo', href: '/seo/categories', label: 'Category SEO', icon: Tag },
    { id: 'analytics', href: '/seo/analytics', label: 'Analytics & Tracking', icon: BarChart3 },
  ];

  const renderMenuLink = (item: SubMenuItem | MenuItem & { href: string }, isSubItem: boolean = false) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isSubItem ? "pl-11" : "pl-3", // Adjusted base padding for top-level links too
        pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
      )}
    >
      <item.icon className="ml-4 h-5 w-5" /> {/* Changed to ml-4 for RTL context */}
      {item.label}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-72 border-r bg-muted/40 p-4">
        <h2 className="mb-6 text-xl font-semibold">SEO Suite</h2>
        <nav className="flex flex-col space-y-1">
          <Accordion
            type="single"
            collapsible
            value={openAccordionId}
            onValueChange={setOpenAccordionId}
            className="w-full"
          >
            {menuItems.map((item) => {
              if (!item.children) {
                return renderMenuLink(item as MenuItem & { href: string }, false); // Pass false for isSubItem
              }
              return (
                <AccordionItem value={item.id} key={item.id} className="border-b-0">
                  <AccordionTrigger
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:no-underline [&[data-state=open]>svg]:rotate-180"
                  >
                    <div className="flex items-center">
                      <item.icon className="ml-4 h-5 w-5" /> {/* Changed to ml-4 for RTL context */}
                      {item.label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-1">
                    {item.children.map((child) => renderMenuLink(child, true))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>
      </aside>
      <main className="flex-1 p-6 lg:p-8"> {/* Removed dir="rtl" here */}
        <TooltipProvider>{children}</TooltipProvider>
      </main>
    </div>
  );
}
