"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-[#2D2C4A] dark:border-t-[#1E2763]",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-[#2D2C4A] dark:border-b-[#1E2763]",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-[#2D2C4A] dark:border-l-[#1E2763]",
    right:
      "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-[#2D2C4A] dark:border-r-[#1E2763]",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`pointer-events-none absolute z-50 whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="rounded-lg bg-[#2D2C4A] px-3 py-2 text-sm font-medium text-white shadow-lg dark:bg-[#1E2763]">
            {content}
          </div>
          <div
            className={`absolute h-0 w-0 border-4 border-transparent ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
