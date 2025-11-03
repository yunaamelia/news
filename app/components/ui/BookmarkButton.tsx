"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked?: boolean;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  onChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  articleId,
  initialBookmarked = false,
  size = "md",
  showText = false,
  onChange,
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?articleId=${articleId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsBookmarked(false);
          if (onChange) onChange(false);
        } else {
          throw new Error("Gagal menghapus bookmark");
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ articleId }),
        });

        if (response.ok) {
          setIsBookmarked(true);
          if (onChange) onChange(true);
        } else {
          throw new Error("Gagal menambahkan bookmark");
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Gagal mengubah bookmark. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-lg transition-all ${sizeClasses[size]} ${
        isBookmarked
          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
      } ${isLoading ? "cursor-not-allowed opacity-50" : "hover:scale-105"} `}
      title={isBookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark"}
    >
      {isBookmarked ? (
        <FaBookmark className={iconSizeClasses[size]} />
      ) : (
        <FiBookmark className={iconSizeClasses[size]} />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isBookmarked ? "Tersimpan" : "Simpan"}
        </span>
      )}
    </button>
  );
}
