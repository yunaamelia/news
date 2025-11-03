"use client";

import Link from "next/link";
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";
import { useState } from "react";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Berita Finansial
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/saham" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Saham
            </Link>
            <Link href="/kripto" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Kripto
            </Link>
            <Link href="/analisis" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Analisis
            </Link>
            <Link href="/edukasi" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Edukasi
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition">
              <FiSearch className="w-5 h-5" />
            </button>
            
            <DarkModeToggle />

            <Link href="/auth/signin" className="hidden md:flex p-2 text-gray-600 hover:text-blue-600 transition">
              <FiUser className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link href="/saham" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Saham
            </Link>
            <Link href="/kripto" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Kripto
            </Link>
            <Link href="/analisis" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Analisis
            </Link>
            <Link href="/edukasi" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Edukasi
            </Link>
            <Link href="/auth/signin" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Masuk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
