// /import/fonts.ts
import localFont from 'next/font/local';

// Roboto Variable Font (Latin charset)
const roboto = localFont({
  src: [
    {
      path: '../fonts/Roboto-VariableFont_wdth,wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../fonts/Roboto-Italic-VariableFont_wdth,wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
  preload: true, // Preload for critical Latin text
  adjustFontFallback: 'Arial', // Fallback for Latin
});

// Tajawal Font (Arabic - Primary)
const tajawal = localFont({
  src: [
    {
      path: '../fonts/Tajawal-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Tajawal-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-tajawal',
  display: 'swap',
  preload: true, // Preload as primary Arabic font
  adjustFontFallback: 'Arial',
});

// Cairo Variable Font (Arabic - Secondary)
const cairo = localFont({
  src: [
    {
      path: '../fonts/cairo.ttf',
      weight: '400 700', // Narrow range to used weights
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
  preload: false, // Only preload if used above the fold
  adjustFontFallback: 'Arial',
});

export { cairo, roboto, tajawal };
