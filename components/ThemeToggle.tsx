'use client';
import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before accessing client-side APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized theme toggle handler
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Avoid rendering theme toggle until mounted
  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';
  return (
    <div>
      <button onClick={toggleTheme} className='mt-2 flex w-full items-center gap-2'>
        {/* Render both icons initially to avoid hydration mismatch */}
        <Sun className={iconVariants({ size: 'xs', className: `${isDark ? 'hidden' : 'text-primary'}` })} /> {/* Use direct import + CVA */}
        <Moon className={iconVariants({ size: 'xs', className: `${isDark ? 'text-primary' : 'hidden'}` })} /> {/* Use direct import + CVA */}
        {/* <span className="mr-2">
            {isDark
              ? UI_TEXT.footer.toggleTheme.light
              : UI_TEXT.footer.toggleTheme.dark}
          </span> */}
      </button>
    </div>
  );
}

export default ThemeToggle;
