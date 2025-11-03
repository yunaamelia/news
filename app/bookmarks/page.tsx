"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArticleCard from "../components/articles/ArticleCard";
import { FiBookmark, FiLoader } from "react-icons/fi";

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

interface Bookmark {
  id: string;
  createdAt: string;
  article: Article;
}

export default function BookmarksPage() {
  const { status } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookmarks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pagination.page]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/bookmarks?page=${pagination.page}&limit=${pagination.limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const data = await response.json();
      setBookmarks(data.bookmarks || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = (articleId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.article.id !== articleId));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiBookmark className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Bookmark Saya
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {pagination.total} artikel tersimpan
          </p>
        </div>

        {/* Bookmarks Grid */}
        {bookmarks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <ArticleCard
                  key={bookmark.id}
                  article={bookmark.article}
                  onBookmarkRemoved={() => handleRemoveBookmark(bookmark.article.id)}
                />
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
          <div className="text-center py-20">
            <FiBookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Belum Ada Bookmark
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Simpan artikel favorit Anda untuk dibaca nanti
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Jelajahi Artikel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
