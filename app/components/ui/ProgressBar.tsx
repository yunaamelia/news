"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "gradient" | "striped";
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  variant = "default",
  size = "md",
  color = "blue",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    default: {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
    },
    gradient: {
      blue: "bg-linear-to-r from-blue-500 to-cyan-500",
      green: "bg-linear-to-r from-green-500 to-emerald-500",
      yellow: "bg-linear-to-r from-yellow-500 to-orange-500",
      red: "bg-linear-to-r from-red-500 to-rose-500",
      purple: "bg-linear-to-r from-purple-500 to-pink-500",
    },
  };

  const bgColor =
    variant === "gradient"
      ? colorClasses.gradient[color]
      : colorClasses.default[color];

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`${sizeClasses[size]} overflow-hidden rounded-full bg-gray-700/50`}
      >
        <div
          className={`${bgColor} h-full transition-all duration-500 ease-out ${
            variant === "striped"
              ? "animate-[progress-stripes_1s_linear_infinite] bg-size-[20px_20px]"
              : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Reading progress bar (sticky to top)
interface ReadingProgressProps {
  target?: HTMLElement | null;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

export function ReadingProgress({
  target,
  color = "blue",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const element = target || document.documentElement;
      const scrollTop = element.scrollTop || window.scrollY;
      const scrollHeight =
        element.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = element.clientHeight || window.innerHeight;
      const totalHeight = scrollHeight - clientHeight;
      const percentage = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
      setProgress(percentage);
    };

    calculateProgress();

    const scrollElement = target || window;
    scrollElement.addEventListener("scroll", calculateProgress);

    return () => {
      scrollElement.removeEventListener("scroll", calculateProgress);
    };
  }, [target]);

  const colorClasses = {
    blue: "bg-linear-to-r from-blue-500 to-cyan-500",
    green: "bg-linear-to-r from-green-500 to-emerald-500",
    yellow: "bg-linear-to-r from-yellow-500 to-orange-500",
    red: "bg-linear-to-r from-red-500 to-rose-500",
    purple: "bg-linear-to-r from-purple-500 to-pink-500",
  };

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-transparent">
      <div
        className={`${colorClasses[color]} h-full shadow-lg transition-all duration-150 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Circular progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  color = "blue",
  className = "",
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    yellow: "stroke-yellow-500",
    red: "stroke-red-500",
    purple: "stroke-purple-500",
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-700/50"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-500 ease-out`}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
