'use client'; // Mark this as a Client Component

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className={iconVariants({ size: 'xs' })} /> : <Moon className={iconVariants({ size: 'xs' })} />} {/* Use direct import + CVA */}
    </Button>
  );
}
