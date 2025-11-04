"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import DarkModeToggle from "../ui/DarkModeToggle";
import HamburgerMenu from "../ui/HamburgerMenu";

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
          ? "navbar-glass-crypto shadow-sticky"
          : "border-b border-white/5 bg-linear-to-r from-[#0a0e27] via-[#121b3a] to-[#0a0e27] shadow-lg backdrop-blur-xs"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo with gradient */}
          <Link
            href="/"
            className="group flex min-w-fit shrink-0 items-center gap-3"
          >
            <div className="bg-gradient-crypto relative flex h-12 w-12 items-center justify-center rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/50">
              <FiTrendingUp className="h-7 w-7 text-white" />
              <div className="bg-gradient-crypto absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity group-hover:opacity-75" />
            </div>
            <div className="flex flex-col">
              <span className="gradient-text-crypto text-2xl font-bold">
                BeritaFinansial
              </span>
              <span className="-mt-1 text-xs text-gray-400">
                Platform #1 Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Temporarily Hidden */}
          <div className="hidden grow items-center justify-center space-x-2">
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
          <div className="flex min-w-fit shrink-0 items-center gap-3">
            <Link
              href="/search"
              className="hidden rounded-xl p-2.5 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-cyan-400 md:flex"
              title="Cari Artikel"
            >
              <FiSearch className="h-5 w-5" />
            </Link>

            <Link
              href="/bookmarks"
              className="hidden rounded-xl p-2.5 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-yellow-400 md:flex"
              title="Bookmark Saya"
            >
              <FiBookOpen className="h-5 w-5" />
            </Link>

            <DarkModeToggle />

            <Link
              href="/auth/signin"
              className="hidden items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 md:flex"
            >
              <FiUser className="h-4 w-4" />
              <span>Masuk</span>
            </Link>

            <Link
              href="/auth/signup"
              className="bg-gradient-crypto hidden items-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 md:flex"
            >
              <span>Daftar Gratis</span>
            </Link>

            {/* Mobile menu button */}
            <HamburgerMenu
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="card-primary border-t border-white/10 shadow-2xl backdrop-blur-2xl lg:hidden">
          <div className="space-y-2 px-4 py-6">
            <Link
              href="/saham"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-blue-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiActivity className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Saham</span>
            </Link>
            <Link
              href="/kripto"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-purple-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiTrendingUp className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Kripto</span>
            </Link>
            <Link
              href="/analisis"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-green-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBarChart2 className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Analisis</span>
            </Link>
            <Link
              href="/edukasi"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-orange-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Edukasi</span>
            </Link>
            <Link
              href="/premium"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiStar className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Premium</span>
              <span className="bg-gradient-crypto animate-pulse rounded-full px-2 py-0.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/30">
                NEW
              </span>
            </Link>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <Link
                href="/auth/signin"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="h-4 w-4" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-crypto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
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
