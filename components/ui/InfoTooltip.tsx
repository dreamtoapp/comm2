'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: React.ReactNode;
  title?: string; // Optional title for the tooltip content
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string; // For TooltipContent styling
  iconSize?: number;
  iconClassName?: string;
}

export default function InfoTooltip({
  content,
  title,
  side = 'top',
  className,
  iconSize = 14,
  iconClassName = "text-muted-foreground"
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon" // Use standard "icon" size
            className="h-5 w-5 p-0" // Adjust padding/size if needed
          >
            <Info size={iconSize} className={iconClassName} />
            <span className="sr-only">معلومات إضافية</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={`max-w-xs text-sm p-3 bg-popover text-popover-foreground shadow-md rounded-md ${className || ''}`}
        >
          {title && <p className="font-semibold mb-1">{title}</p>}
          {typeof content === 'string' ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
