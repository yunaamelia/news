"use client";

import Link from "next/link";
import Image from "next/image";
import { FiClock, FiEye } from "react-icons/fi";
import { Article } from "@/app/types";
import BookmarkButton from "../ui/BookmarkButton";
import { calculateReadingTime } from "@/app/lib/reading-time";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface ArticleCardProps {
  article: Article;
  onBookmarkRemoved?: () => void;
}

export default function ArticleCard({ article, onBookmarkRemoved }: ArticleCardProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Calculate reading time from content (if available) or estimate from excerpt
  const readingTime = article.content 
    ? calculateReadingTime(article.content)
    : Math.max(1, Math.ceil(article.excerpt.split(" ").length / 200));

  useEffect(() => {
    if (!session) {
      setIsChecking(false);
      return;
    }

    // Check if article is bookmarked
    const checkBookmark = async () => {
      try {
        const response = await fetch(`/api/bookmarks?articleId=${article.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.bookmarks?.some((b: { article: { id: string } }) => b.article.id === article.id) || false);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkBookmark();
  }, [session, article.id]);

  const handleBookmarkChange = (bookmarked: boolean) => {
    setIsBookmarked(bookmarked);
    if (!bookmarked && onBookmarkRemoved) {
      onBookmarkRemoved();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition relative group">
      {/* Bookmark Button (Top Right) */}
      {session && !isChecking && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <BookmarkButton
            articleId={article.id}
            initialBookmarked={isBookmarked}
            size="sm"
            onChange={handleBookmarkChange}
          />
        </div>
      )}

      <Link href={`/artikel/${article.slug}`} className="block">
        {article.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
              {article.category}
            </span>
            {article.isPremium && (
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">
                Premium
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-3">
              <span>{article.author}</span>
              <div className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>{readingTime} menit</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center gap-1">
                  <FiEye className="w-3 h-3" />
                  <span>{article.views}</span>
                </div>
              )}
            </div>
            <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
