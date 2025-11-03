"use client";

import { forwardRef, ReactNode, SelectHTMLAttributes } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  leftIcon?: ReactNode;
  helperText?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      leftIcon,
      helperText,
      placeholder = "Pilih opsi...",
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

        {/* Select container */}
        <div className="group relative">
          {/* Gradient border effect */}
          <div
            className={`absolute -inset-0.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 opacity-0 blur transition-opacity duration-300 ${
              !disabled && !error ? "group-focus-within:opacity-50" : ""
            } ${error ? "from-red-500 to-rose-500 opacity-50" : ""}`}
          />

          {/* Select wrapper */}
          <div className="relative flex items-center">
            {/* Left icon */}
            {leftIcon && (
              <div className="absolute left-4 z-10 text-gray-500 transition-colors duration-300 group-focus-within:text-blue-400">
                {leftIcon}
              </div>
            )}

            {/* Select field */}
            <select
              ref={ref}
              className={`glass-card relative w-full appearance-none rounded-xl border px-4 py-3 text-white transition-all duration-300 focus:outline-none ${leftIcon ? "pl-12" : ""} pr-12 ${
                error
                  ? "border-red-500/50 focus:border-red-400"
                  : "border-white/10 focus:border-purple-400"
              } ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-blue-400/30"
              } ${className} `}
              disabled={disabled}
              {...props}
            >
              {placeholder && (
                <option value="" disabled hidden>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-gray-900 text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Chevron icon */}
            <div className="pointer-events-none absolute right-4 text-gray-500 transition-all duration-300 group-focus-within:rotate-180 group-focus-within:text-blue-400">
              <FiChevronDown className="h-5 w-5" />
            </div>
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

Select.displayName = "Select";

export default Select;
