"use client";

import { calculateReadingTime } from "@/app/lib/reading-time";
import { Article } from "@/app/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiClock, FiEye } from "react-icons/fi";
import BookmarkButton from "../ui/BookmarkButton";

interface ArticleCardProps {
  article: Article;
  onBookmarkRemoved?: () => void;
}

export default function ArticleCard({
  article,
  onBookmarkRemoved,
}: ArticleCardProps) {
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
          setIsBookmarked(
            data.bookmarks?.some(
              (b: { article: { id: string } }) => b.article.id === article.id
            ) || false
          );
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
    <div className="group glass-card animate-fade-in-up relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/5 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Bookmark Button (Top Right) */}
      {session && !isChecking && (
        <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
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
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
          </div>
        )}
        <div className="p-4">
          <div className="mb-3 flex items-center space-x-2">
            <span className="rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-md">
              {article.category}
            </span>
            {article.isPremium && (
              <span className="animate-pulse rounded-full bg-linear-to-r from-yellow-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                Premium
              </span>
            )}
          </div>
          <h3 className="group-hover:gradient-text mb-3 line-clamp-2 text-xl font-bold text-white transition-colors duration-300">
            {article.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>{article.author}</span>
              <div className="flex items-center gap-1">
                <FiClock className="h-3 w-3" />
                <span>{readingTime} menit</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center gap-1">
                  <FiEye className="h-3 w-3" />
                  <span>{article.views}</span>
                </div>
              )}
            </div>
            <span>
              {new Date(
                article.publishedAt || article.createdAt
              ).toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
