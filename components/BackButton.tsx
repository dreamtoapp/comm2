"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function BackButton({ label = "الرجوع", className = "" }: { label?: string; className?: string }) {
  const router = useRouter();

  // Fallback: if history is empty, go to dashboard root
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleBack}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 transition-colors bg-background hover:bg-muted ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 rtl:rotate-180" />
      <span className="hidden xs:inline-block md:inline-block">{label}</span>
    </Button>
  );
}
