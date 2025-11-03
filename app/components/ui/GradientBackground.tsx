"use client";

import { motion } from "framer-motion";

interface GradientBackgroundProps {
  variant?: "blue" | "purple" | "cyan" | "mesh" | "dark";
  animated?: boolean;
  opacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function GradientBackground({
  variant = "blue",
  animated = true,
  opacity = 1,
  children,
  className = "",
}: GradientBackgroundProps) {
  const gradients = {
    blue: "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800",
    purple: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600",
    cyan: "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600",
    mesh: "gradient-mesh",
    dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Main gradient background */}
      <div className={`absolute inset-0 ${gradients[variant]}`} />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Animated blobs */}
      {animated && (
        <>
          <motion.div
            className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-purple-500 opacity-30 mix-blend-multiply blur-3xl filter"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 -right-4 h-72 w-72 rounded-full bg-blue-500 opacity-30 mix-blend-multiply blur-3xl filter"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-indigo-500 opacity-30 mix-blend-multiply blur-3xl filter"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
