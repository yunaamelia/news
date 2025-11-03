"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-blue-600 transition"
        aria-label="Search"
      >
        <FiSearch className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <FiSearch className="w-6 h-6 text-gray-400" />
                <form onSubmit={handleSearch} className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari artikel, saham, atau kripto..."
                    autoFocus
                    className="w-full text-lg outline-none"
                  />
                </form>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-500 font-medium">
                  Pencarian Populer:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Bitcoin", "BBCA", "Ethereum", "Analisis", "Regulasi"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setQuery(tag);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
