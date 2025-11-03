"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import ArticleCard from "../components/articles/ArticleCard";
import { ArticleCategory } from "@prisma/client";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  authorImage?: string;
  isPremium: boolean;
  views: number;
  publishedAt: Date | string;
  createdAt: Date | string;
}

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
    premium: searchParams.get("premium") || "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset page on filter change
      return params.toString();
    },
    [searchParams]
  );

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.premium && { premium: filters.premium }),
      });

      const response = await fetch(`/api/articles/search?${params}`);
      const data = await response.json();

      setArticles(data.articles || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query, filters, pagination.page, performSearch]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    router.push(pathname + "?" + createQueryString(name, value));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      sortBy: "relevance",
      premium: "",
    });
    setQuery("");
    router.push(pathname);
  };

  const categories = [
    { value: "", label: "Semua Kategori" },
    { value: ArticleCategory.SAHAM, label: "Saham" },
    { value: ArticleCategory.KRIPTO, label: "Kripto" },
    { value: ArticleCategory.ANALISIS, label: "Analisis" },
    { value: ArticleCategory.EDUKASI, label: "Edukasi" },
    { value: ArticleCategory.REGULASI, label: "Regulasi" },
    { value: ArticleCategory.TEKNOLOGI, label: "Teknologi" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevansi" },
    { value: "date", label: "Terbaru" },
    { value: "views", label: "Populer" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cari Artikel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Temukan artikel yang Anda cari dengan mudah
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, konten, atau tag artikel..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <FiFilter className="w-4 h-4" />
            <span>Filter & Urutkan</span>
          </button>

          {showFilters && (
            <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urutkan
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {sortOptions.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Premium Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipe Artikel
                  </label>
                  <select
                    value={filters.premium}
                    onChange={(e) => handleFilterChange("premium", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Semua Artikel</option>
                    <option value="false">Gratis</option>
                    <option value="true">Premium</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <FiX className="w-4 h-4" />
                  <span>Hapus Filter</span>
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pagination.total} artikel ditemukan
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Tidak ada artikel yang ditemukan
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Coba ubah kata kunci atau filter pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
