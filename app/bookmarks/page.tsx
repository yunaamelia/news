"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiBookmark, FiLoader } from "react-icons/fi";
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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <FiBookmark className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <ArticleCard
                  key={bookmark.id}
                  article={bookmark.article}
                  onBookmarkRemoved={() =>
                    handleRemoveBookmark(bookmark.article.id)
                  }
                />
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
          <div className="py-20 text-center">
            <FiBookmark className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Belum Ada Bookmark
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Simpan artikel favorit Anda untuk dibaca nanti
            </p>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
            >
              Jelajahi Artikel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
