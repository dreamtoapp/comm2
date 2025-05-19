"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    // Detect RTL from document direction
    if (typeof window !== "undefined") {
      setIsRtl(document.dir === "rtl");
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="العودة للخلف"
      onClick={() => router.back()}
      className="mr-1 md:mr-2 rounded-full border border-border bg-background hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
    >
      {isRtl ? <ArrowRight size={22} /> : <ArrowLeft size={22} />}
    </Button>
  );
}
