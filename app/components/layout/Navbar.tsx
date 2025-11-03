"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiMenu,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiX,
} from "react-icons/fi";
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
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card shadow-2xl"
          : "bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo with gradient */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/50">
              <FiTrendingUp className="h-7 w-7 text-white" />
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-400 to-purple-400 opacity-0 blur transition-opacity group-hover:opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent">
                BeritaFinansial
              </span>
              <span className="-mt-1 text-xs text-gray-400 dark:text-gray-500">
                Platform #1 Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-2 lg:flex">
            <Link
              href="/saham"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-blue-500/20 hover:to-blue-600/20 hover:text-blue-400"
            >
              <FiActivity className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Saham</span>
            </Link>
            <Link
              href="/kripto"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-purple-500/20 hover:to-purple-600/20 hover:text-purple-400"
            >
              <FiTrendingUp className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Kripto</span>
            </Link>
            <Link
              href="/analisis"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400"
            >
              <FiBarChart2 className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Analisis</span>
            </Link>
            <Link
              href="/edukasi"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-orange-500/20 hover:to-orange-600/20 hover:text-orange-400"
            >
              <FiBookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Edukasi</span>
            </Link>
            <Link
              href="/premium"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-yellow-500/20 hover:to-yellow-600/20 hover:text-yellow-400"
            >
              <FiStar className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Premium</span>
              <span className="animate-pulse rounded-full bg-linear-to-r from-yellow-400 to-orange-400 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                NEW
              </span>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden rounded-lg p-2.5 text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600 md:flex dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
              title="Cari Artikel"
            >
              <FiSearch className="h-5 w-5" />
            </Link>

            <Link
              href="/bookmarks"
              className="hidden rounded-lg p-2.5 text-gray-600 transition-all hover:bg-yellow-50 hover:text-yellow-600 md:flex dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-yellow-400"
              title="Bookmark Saya"
            >
              <FiBookOpen className="h-5 w-5" />
            </Link>

            <DarkModeToggle />

            <Link
              href="/auth/signin"
              className="hidden items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-gray-700 transition-all hover:bg-gray-100 md:flex dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiUser className="h-4 w-4" />
              <span>Masuk</span>
            </Link>

            <Link
              href="/auth/signup"
              className="hidden items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg md:flex"
            >
              <span>Daftar Gratis</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2.5 text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="glass-card border-t border-white/10 shadow-2xl backdrop-blur-2xl lg:hidden">
          <div className="space-y-2 px-4 py-6">
            <Link
              href="/saham"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-blue-500/20 hover:to-blue-600/20 hover:text-blue-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiActivity className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Saham</span>
            </Link>
            <Link
              href="/kripto"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-purple-500/20 hover:to-purple-600/20 hover:text-purple-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiTrendingUp className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Kripto</span>
            </Link>
            <Link
              href="/analisis"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBarChart2 className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Analisis</span>
            </Link>
            <Link
              href="/edukasi"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-orange-500/20 hover:to-orange-600/20 hover:text-orange-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Edukasi</span>
            </Link>
            <Link
              href="/premium"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-all duration-300 hover:bg-linear-to-r hover:from-yellow-500/20 hover:to-yellow-600/20 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiStar className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Premium</span>
              <span className="animate-pulse rounded-full bg-linear-to-r from-yellow-400 to-orange-400 px-2 py-0.5 text-xs font-semibold text-white">
                NEW
              </span>
            </Link>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <Link
                href="/auth/signin"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 px-4 py-3 font-medium text-gray-300 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="h-4 w-4" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30"
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
