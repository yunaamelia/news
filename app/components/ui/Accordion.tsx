"use client";

import { ReactNode, useState } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
  className?: string;
}

export default function Accordion({
  items,
  defaultOpen = [],
  allowMultiple = false,
  variant = "default",
  className = "",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(id);

      if (allowMultiple) {
        return isOpen ? prev.filter((item) => item !== id) : [...prev, id];
      }

      return isOpen ? [] : [id];
    });
  };

  const variantStyles = {
    default: {
      container: "space-y-2",
      item: "rounded-xl bg-gray-800/50 backdrop-blur-xl",
      header: "px-6 py-4",
      content: "px-6 pb-4",
    },
    bordered: {
      container: "divide-y divide-white/10 rounded-xl border border-white/10",
      item: "",
      header: "px-6 py-4",
      content: "px-6 pb-4",
    },
    separated: {
      container: "space-y-4",
      item: "rounded-xl border border-white/10 bg-gray-800/30 backdrop-blur-xl",
      header: "px-6 py-4",
      content: "px-6 pb-4",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className={styles.item}>
            {/* Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className={`${styles.header} flex w-full items-center justify-between text-left transition hover:bg-white/5`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="shrink-0 text-blue-400">{item.icon}</span>
                )}
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </div>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Content */}
            {isOpen && (
              <div
                className={`${styles.content} animate-[slide-down_0.2s_ease-out]`}
              >
                <div className="text-gray-300">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Controlled accordion for more flexibility
interface ControlledAccordionProps {
  items: AccordionItem[];
  openItems: string[];
  onToggle: (id: string) => void;
  variant?: "default" | "bordered" | "separated";
  className?: string;
}

export function ControlledAccordion({
  items,
  openItems,
  onToggle,
  variant = "default",
  className = "",
}: ControlledAccordionProps) {
  const variantStyles = {
    default: {
      container: "space-y-2",
      item: "rounded-xl bg-gray-800/50 backdrop-blur-xl",
      header: "px-6 py-4",
      content: "px-6 pb-4",
    },
    bordered: {
      container: "divide-y divide-white/10 rounded-xl border border-white/10",
      item: "",
      header: "px-6 py-4",
      content: "px-6 pb-4",
    },
    separated: {
      container: "space-y-4",
      item: "rounded-xl border border-white/10 bg-gray-800/30 backdrop-blur-xl",
      header: "px-6 py-4",
      content: "px-6 pb-4",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className={styles.item}>
            {/* Header */}
            <button
              onClick={() => onToggle(item.id)}
              className={`${styles.header} flex w-full items-center justify-between text-left transition hover:bg-white/5`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="shrink-0 text-blue-400">{item.icon}</span>
                )}
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </div>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Content */}
            {isOpen && (
              <div
                className={`${styles.content} animate-[slide-down_0.2s_ease-out]`}
              >
                <div className="text-gray-300">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
