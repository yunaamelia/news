"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize on mount using callback pattern to avoid setState in effect warning
  useEffect(() => {
    const initializeDarkMode = () => {
      // Support both legacy 'darkMode' (boolean string) and 'theme' ("dark"|"light") keys
      const theme = localStorage.getItem("theme");
      const legacy = localStorage.getItem("darkMode");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const isDark =
        theme === "dark" ||
        (theme === null &&
          (legacy === "true" || (legacy === null && prefersDark)));

      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
      setMounted(true);
    };

    // Use requestAnimationFrame to defer state updates
    requestAnimationFrame(initializeDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Persist in both formats for compatibility
    localStorage.setItem("darkMode", String(newMode));
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  if (!mounted) {
    return (
      <div className="flex h-11 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="h-8 w-8" />
      </div>
    );
  }

  return (
    <label
      htmlFor="darkToggler"
      className="flex h-11 w-20 cursor-pointer items-center justify-center rounded-full bg-[#F3F4F6] transition-colors dark:bg-[#1E2763]"
    >
      <input
        type="checkbox"
        id="darkToggler"
        className="sr-only"
        checked={darkMode}
        onChange={toggleDarkMode}
        aria-label="Toggle dark mode"
      />
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          darkMode
            ? "bg-transparent text-[#8896A4]"
            : "bg-[#3e7dff] text-white shadow-md"
        }`}
      >
        <FiSun className="h-4 w-4" />
      </span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          darkMode
            ? "bg-[#3e7dff] text-white shadow-md"
            : "bg-transparent text-[#8896A4]"
        }`}
      >
        <FiMoon className="h-4 w-4" />
      </span>
    </label>
  );
}
