"use client";

import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiTrendingUp,
  FiBarChart2,
  FiBookOpen,
  FiStar,
  FiActivity,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg"
          : "bg-white dark:bg-gray-900 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with gradient */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BeritaFinansial
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Platform #1 Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/saham"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-all"
            >
              <FiActivity className="w-4 h-4" />
              <span className="font-medium">Saham</span>
            </Link>
            <Link
              href="/kripto"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-600 transition-all"
            >
              <FiTrendingUp className="w-4 h-4" />
              <span className="font-medium">Kripto</span>
            </Link>
            <Link
              href="/analisis"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 transition-all"
            >
              <FiBarChart2 className="w-4 h-4" />
              <span className="font-medium">Analisis</span>
            </Link>
            <Link
              href="/edukasi"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 transition-all"
            >
              <FiBookOpen className="w-4 h-4" />
              <span className="font-medium">Edukasi</span>
            </Link>
            <Link
              href="/premium"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-800 hover:text-yellow-600 transition-all"
            >
              <FiStar className="w-4 h-4" />
              <span className="font-medium">Premium</span>
              <span className="text-xs px-2 py-0.5 bg-linear-to-r from-yellow-400 to-orange-400 text-white rounded-full font-semibold">
                NEW
              </span>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all">
              <FiSearch className="w-5 h-5" />
            </button>

            <DarkModeToggle />

            <Link
              href="/auth/signin"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all"
            >
              <FiUser className="w-4 h-4" />
              <span>Masuk</span>
            </Link>

            <Link
              href="/auth/signup"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <span>Daftar Gratis</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
          <div className="px-4 py-6 space-y-2">
            <Link
              href="/saham"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiActivity className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Saham</span>
            </Link>
            <Link
              href="/kripto"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Kripto</span>
            </Link>
            <Link
              href="/analisis"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBarChart2 className="w-5 h-5 text-green-600" />
              <span className="font-medium">Analisis</span>
            </Link>
            <Link
              href="/edukasi"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBookOpen className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Edukasi</span>
            </Link>
            <Link
              href="/premium"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiStar className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Premium</span>
              <span className="text-xs px-2 py-0.5 bg-linear-to-r from-yellow-400 to-orange-400 text-white rounded-full font-semibold">
                NEW
              </span>
            </Link>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="w-4 h-4" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Daftar Gratis</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
