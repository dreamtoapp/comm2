'use client';

import Script from 'next/script';

/**
 * Component to add performance optimization scripts
 * Focuses on optimizing the first 8 products that are visible
 */
export default function PreloadScript() {
  return (
    <>
      {/* Simple performance optimization script */}
      <Script id='performance-optimization' strategy='afterInteractive'>
        {`
          // Apply optimizations after DOM is loaded
          document.addEventListener('DOMContentLoaded', () => {
            // Optimize first 8 elements for faster rendering
            const visibleElements = document.querySelectorAll('.product-card:nth-child(-n+8)');
            visibleElements.forEach(el => {
              el.style.willChange = 'transform';
            });
          });
        `}
      </Script>
    </>
  );
}
