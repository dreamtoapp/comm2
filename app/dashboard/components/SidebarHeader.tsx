import { Home, LayoutGrid } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import Link from '@/components/link';

// Removed Icon import: import { Icon } from '@/components/icons';

export default function SidebarHeader() {
  return (
    <header className='flex flex-col items-center gap-2 rounded-b-lg border-b bg-white py-6 shadow'>
      <nav className='flex flex-row-reverse items-center gap-6'>
        <Link href='/dashboard' className='group' aria-label='الرئيسية'>
          <Home className={iconVariants({ size: 'md', className: 'text-blue-600 transition group-hover:text-blue-800' })} /> {/* Use direct import + CVA (adjust size if needed) */}
        </Link>
        <Link href='/dashboard' className='group' aria-label='التطبيقات'>
          <LayoutGrid className={iconVariants({ size: 'md', className: 'text-blue-600 transition group-hover:text-blue-800' })} /> {/* Use direct import + CVA (adjust size if needed) */}
        </Link>
      </nav>
    </header>
  );
}
