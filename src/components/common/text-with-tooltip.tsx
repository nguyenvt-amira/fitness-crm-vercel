import React, { useEffect, useRef, useState } from 'react';

import { TooltipPortal } from '@radix-ui/react-tooltip';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

interface TextWithTooltipProps {
  text: string | number;
  className?: string;
  lines?: number; // 1-6 for line-clamp, undefined for single line truncate
}

export function TextWithTooltip({ text, className, lines }: Readonly<TextWithTooltipProps>) {
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Get line-clamp class based on lines prop
  const lineClampClass = lines && lines >= 1 && lines <= 6 ? `line-clamp-${lines}` : 'truncate';

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;

        // For line-clamp or truncate
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        const scrollWidth = element.scrollWidth;
        const clientWidth = element.clientWidth;

        // Check if text is truncated (either horizontally or vertically)
        const isTrunc = scrollWidth > clientWidth || scrollHeight > clientHeight;
        setIsTruncated(isTrunc);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    checkTruncation();

    return () => {
      resizeObserver.disconnect();
    };
  }, [lines]);

  return (
    <TooltipProvider delay={100}>
      <Tooltip>
        <TooltipTrigger disabled={!isTruncated}>
          <div
            ref={textRef}
            className={cn(lineClampClass, !isTruncated && 'pointer-events-none', className)}
          >
            {text}
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="break-word max-h-60 max-w-xs overflow-y-auto">
            {text}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
