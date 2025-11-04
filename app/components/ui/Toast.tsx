"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: {
      bg: "bg-green-500/10 border-green-500/50",
      icon: "✓",
      iconBg: "bg-linear-to-r from-green-500 to-emerald-500",
    },
    error: {
      bg: "bg-red-500/10 border-red-500/50",
      icon: "✕",
      iconBg: "bg-linear-to-r from-red-500 to-rose-500",
    },
    warning: {
      bg: "bg-yellow-500/10 border-yellow-500/50",
      icon: "⚠",
      iconBg: "bg-linear-to-r from-yellow-500 to-orange-500",
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/50",
      icon: "ℹ",
      iconBg: "bg-linear-to-r from-blue-500 to-purple-500",
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`${
        isExiting
          ? "animate-[slide-out-right_0.3s_ease-out]"
          : "animate-[slide-in-right_0.3s_ease-out]"
      } ${style.bg} rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <div
          className={`${style.iconBg} flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white`}
        >
          {style.icon}
        </div>
        <p className="flex-1 text-sm font-medium text-white">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onClose(id), 300);
          }}
          className="shrink-0 text-gray-400 transition hover:text-white"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastProps[];
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
}

export function ToastContainer({
  toasts,
  position = "top-right",
}: ToastContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
  };

  if (typeof window === "undefined" || toasts.length === 0) return null;

  return createPortal(
    <div
      className={`${positionClasses[position]} fixed z-9999 flex w-full max-w-sm flex-col gap-2`}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
}

// Custom hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [counter, setCounter] = useState(0);

  const showToast = (type: ToastType, message: string, duration?: number) => {
    const id = `toast-${counter}`;
    setCounter((prev) => prev + 1);
    const newToast: ToastProps = {
      id,
      type,
      message,
      duration,
      onClose: removeToast,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    success: (message: string, duration?: number) =>
      showToast("success", message, duration),
    error: (message: string, duration?: number) =>
      showToast("error", message, duration),
    warning: (message: string, duration?: number) =>
      showToast("warning", message, duration),
    info: (message: string, duration?: number) =>
      showToast("info", message, duration),
  };
}
