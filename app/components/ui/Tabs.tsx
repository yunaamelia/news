"use client";

import { ReactNode, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = "default",
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantStyles = {
    default: {
      container: "rounded-xl bg-gray-800/50 p-1",
      button: "rounded-lg px-4 py-2",
      active: "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg",
      inactive: "text-gray-400 hover:text-white hover:bg-white/5",
    },
    pills: {
      container: "gap-2",
      button: "rounded-full px-6 py-2",
      active: "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg",
      inactive:
        "border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50",
    },
    underline: {
      container: "border-b border-white/10",
      button: "px-4 py-3 border-b-2 border-transparent",
      active: "border-blue-500 text-white",
      inactive: "text-gray-400 hover:text-white hover:border-white/20",
    },
  };

  const styles = variantStyles[variant];
  const activeContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={className}>
      {/* Tab buttons */}
      <div className={`flex ${styles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`${styles.button} flex items-center gap-2 font-medium transition-all ${
              activeTab === tab.id ? styles.active : styles.inactive
            } ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">{activeContent?.content}</div>
    </div>
  );
}

// Controlled tabs component for more flexibility
interface ControlledTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  className?: string;
}

export function ControlledTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  className = "",
}: ControlledTabsProps) {
  const variantStyles = {
    default: {
      container: "rounded-xl bg-gray-800/50 p-1",
      button: "rounded-lg px-4 py-2",
      active: "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg",
      inactive: "text-gray-400 hover:text-white hover:bg-white/5",
    },
    pills: {
      container: "gap-2",
      button: "rounded-full px-6 py-2",
      active: "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg",
      inactive:
        "border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50",
    },
    underline: {
      container: "border-b border-white/10",
      button: "px-4 py-3 border-b-2 border-transparent",
      active: "border-blue-500 text-white",
      inactive: "text-gray-400 hover:text-white hover:border-white/20",
    },
  };

  const styles = variantStyles[variant];
  const activeContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={className}>
      {/* Tab buttons */}
      <div className={`flex ${styles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`${styles.button} flex items-center gap-2 font-medium transition-all ${
              activeTab === tab.id ? styles.active : styles.inactive
            } ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">{activeContent?.content}</div>
    </div>
  );
}
