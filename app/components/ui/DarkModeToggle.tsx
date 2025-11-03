"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize on mount using callback pattern to avoid setState in effect warning
  useEffect(() => {
    const initializeDarkMode = () => {
      const isDark =
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
      setMounted(true);
    };

    // Use requestAnimationFrame to defer state updates
    requestAnimationFrame(initializeDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <button className="p-2 text-gray-600 hover:text-blue-600 transition">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FiSun className="w-5 h-5" />
      ) : (
        <FiMoon className="w-5 h-5" />
      )}
    </button>
  );
}
