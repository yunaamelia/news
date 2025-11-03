"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {/* Label with gradient animation */}
        {label && (
          <label className="mb-2 block text-sm font-bold text-gray-300 transition-colors duration-300">
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="group relative">
          {/* Gradient border effect */}
          <div
            className={`absolute -inset-0.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 opacity-0 blur transition-opacity duration-300 ${
              !disabled && !error ? "group-focus-within:opacity-50" : ""
            } ${error ? "from-red-500 to-rose-500 opacity-50" : ""}`}
          />

          {/* Input wrapper */}
          <div className="relative flex items-center">
            {/* Left icon */}
            {leftIcon && (
              <div className="absolute left-4 text-gray-500 transition-colors duration-300 group-focus-within:text-blue-400">
                {leftIcon}
              </div>
            )}

            {/* Input field */}
            <input
              ref={ref}
              className={`glass-card relative w-full rounded-xl border px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${leftIcon ? "pl-12" : ""} ${rightIcon ? "pr-12" : ""} ${
                error
                  ? "border-red-500/50 focus:border-red-400"
                  : "border-white/10 focus:border-purple-400"
              } ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-blue-400/30"
              } ${className} `}
              disabled={disabled}
              {...props}
            />

            {/* Right icon */}
            {rightIcon && (
              <div className="absolute right-4 text-gray-500 transition-colors duration-300 group-focus-within:text-blue-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper text or error message */}
        {(helperText || error) && (
          <p
            className={`mt-2 text-xs font-medium transition-colors duration-300 ${
              error ? "text-red-400" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
