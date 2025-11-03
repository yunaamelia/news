"use client";

import { ArticleCategory } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import ArticleCard from "../components/articles/ArticleCard";

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            Cari Artikel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Temukan artikel yang Anda cari dengan mudah
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <FiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, konten, atau tag artikel..."
              className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-4 pl-12 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <FiFilter className="h-4 w-4" />
            <span>Filter & Urutkan</span>
          </button>

          {showFilters && (
            <div className="mt-4 rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Category Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kategori
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Urutkan
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipe Artikel
                  </label>
                  <select
                    value={filters.premium}
                    onChange={(e) =>
                      handleFilterChange("premium", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Semua Artikel</option>
                    <option value="false">Gratis</option>
                    <option value="true">Premium</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <FiX className="h-4 w-4" />
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: i + 1 }))
                    }
                    className={`rounded-lg px-4 py-2 font-medium transition-all ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Tidak ada artikel yang ditemukan
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Coba ubah kata kunci atau filter pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
