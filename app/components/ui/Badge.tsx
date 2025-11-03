import { ReactNode } from "react";

interface BadgeProps {
  variant?:
    | "crypto"
    | "saham"
    | "analisis"
    | "edukasi"
    | "regulasi"
    | "teknologi"
    | "premium"
    | "success"
    | "danger"
    | "warning";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export default function Badge({
  variant = "crypto",
  size = "md",
  children,
  className = "",
  animated = false,
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-full";

  const variantClasses = {
    crypto: "bg-gradient-crypto text-white shadow-md shadow-blue-500/30",
    saham:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30",
    analisis:
      "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/30",
    edukasi:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30",
    regulasi:
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/30",
    teknologi:
      "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/30",
    premium: "bg-gradient-premium text-white shadow-md shadow-orange-500/30",
    success: "bg-gradient-success text-white shadow-md shadow-green-500/30",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/30",
    warning:
      "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md shadow-yellow-500/30",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  const animationClass = animated ? "animate-pulse" : "";

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${animationClass} ${className}`}
    >
      {children}
    </span>
  );
}
