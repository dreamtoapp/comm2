'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error); // Default logging
    // You can replace this with a call to Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f3f4f6' // Light gray background
        }}>
          <h1 style={{ fontSize: '2rem', color: '#dc2626', marginBottom: '1rem' }}>
            حدث خطأ ما! (Something went wrong!)
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '0.5rem' }}>
            نأسف، لقد واجهنا مشكلة غير متوقعة.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            (Sorry, we encountered an unexpected issue.)
          </p>
          {error?.message && (
            <details style={{
              marginBottom: '1.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              maxWidth: '600px',
              overflowWrap: 'break-word'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '500', color: '#374151' }}>
                تفاصيل الخطأ (Error Details)
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: '#4b5563',
                whiteSpace: 'pre-wrap',
                textAlign: 'left'
              }}>
                {error.message}
                {error.digest && ` (Digest: ${error.digest})`}
              </pre>
            </details>
          )}
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            variant="destructive" // Assuming your Button has variants
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
            }}
          >
            حاول مرة أخرى (Try again)
          </Button>
          <a
            href="/"
            style={{
              marginTop: '1rem',
              color: '#1d4ed8', // Blue link color
              textDecoration: 'underline'
            }}
          >
            العودة إلى الصفحة الرئيسية (Go to Homepage)
          </a>
        </div>
      </body>
    </html>
  );
}
