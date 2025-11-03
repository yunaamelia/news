"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiClock, FiUser, FiSearch } from "react-icons/fi";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  publishedAt: string;
  category: string;
  author: { name: string } | null;
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });
      if (category !== "ALL") params.append("category", category);
      if (search) params.append("search", search);

      const res = await fetch(`/api/articles?${params}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const categories = [
    { value: "ALL", label: "Semua", color: "gray" },
    { value: "SAHAM", label: "Saham", color: "blue" },
    { value: "KRIPTO", label: "Kripto", color: "purple" },
    { value: "ANALISIS", label: "Analisis", color: "green" },
    { value: "EDUKASI", label: "Edukasi", color: "amber" },
    { value: "REGULASI", label: "Regulasi", color: "red" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Semua <span className="text-blue-600">Artikel</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi artikel terbaru tentang pasar finansial Indonesia
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Cari
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  category === cat.value
                    ? `bg-${cat.color}-600 text-white`
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-lg text-gray-600">Tidak ada artikel ditemukan</p>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const catColor =
                  categories.find((c) => c.value === article.category)?.color || "gray";
                return (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {article.imageUrl && (
                      <div
                        className={`aspect-video bg-linear-to-br from-${catColor}-500 to-${catColor}-600 relative overflow-hidden`}
                      >
                        <div
                          className={`absolute top-4 left-4 bg-${catColor}-600 text-white px-3 py-1 rounded-lg text-xs font-semibold`}
                        >
                          {article.category}
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          <span>{article.author?.name || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        <span>Baca Selengkapnya</span>
                        <FiArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-semibold ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
