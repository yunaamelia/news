"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ReactionType } from "@prisma/client";

interface ReactionCounts {
  LIKE: number;
  LOVE: number;
  INSIGHTFUL: number;
  BULLISH: number;
  BEARISH: number;
}

interface ReactionData {
  counts: ReactionCounts;
  userReaction: ReactionType | null;
  total: number;
}

interface ReactionButtonsProps {
  articleSlug: string;
}

const reactionConfig: Record<
  ReactionType,
  { emoji: string; label: string; color: string }
> = {
  LIKE: { emoji: "👍", label: "Suka", color: "hover:bg-blue-500/10" },
  LOVE: { emoji: "❤️", label: "Love", color: "hover:bg-red-500/10" },
  INSIGHTFUL: { emoji: "💡", label: "Insightful", color: "hover:bg-yellow-500/10" },
  BULLISH: { emoji: "📈", label: "Bullish", color: "hover:bg-green-500/10" },
  BEARISH: { emoji: "📉", label: "Bearish", color: "hover:bg-red-600/10" },
};

export function ReactionButtons({ articleSlug }: ReactionButtonsProps) {
  const { status } = useSession();
  const router = useRouter();
  const [reactionData, setReactionData] = useState<ReactionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reactions on mount
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const response = await fetch(`/api/articles/${articleSlug}/reactions`);
        if (response.ok) {
          const data = await response.json();
          setReactionData(data);
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };
    loadReactions();
  }, [articleSlug]);

  const handleReaction = async (type: ReactionType) => {
    // Redirect to signin if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      const isCurrentReaction = reactionData?.userReaction === type;

      if (isCurrentReaction) {
        // Remove reaction
        const response = await fetch(`/api/articles/${articleSlug}/reactions`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove reaction");
        }

        // Optimistic update
        setReactionData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            counts: {
              ...prev.counts,
              [type]: Math.max(0, prev.counts[type] - 1),
            },
            userReaction: null,
            total: prev.total - 1,
          };
        });
      } else {
        // Add/change reaction
        const response = await fetch(`/api/articles/${articleSlug}/reactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });

        if (!response.ok) {
          throw new Error("Failed to add reaction");
        }

        // Optimistic update
        setReactionData((prev) => {
          if (!prev) return prev;
          const newCounts = { ...prev.counts };
          
          // Decrease old reaction count if exists
          if (prev.userReaction) {
            newCounts[prev.userReaction] = Math.max(
              0,
              newCounts[prev.userReaction] - 1
            );
          }
          
          // Increase new reaction count
          newCounts[type] = newCounts[type] + 1;

          return {
            ...prev,
            counts: newCounts,
            userReaction: type,
            total: prev.userReaction ? prev.total : prev.total + 1,
          };
        });
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      // Refetch to get correct state
      try {
        const response = await fetch(`/api/articles/${articleSlug}/reactions`);
        if (response.ok) {
          const data = await response.json();
          setReactionData(data);
        }
      } catch {
        // Silent fail on refetch
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!reactionData) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(reactionConfig) as ReactionType[]).map((type) => {
        const config = reactionConfig[type];
        const count = reactionData.counts[type];
        const isActive = reactionData.userReaction === type;

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={isLoading}
            className={`
              group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              transition-all duration-200
              ${isActive 
                ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30" 
                : "bg-white/5 border border-white/10"
              }
              ${config.color}
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label={`${config.label} reaction`}
          >
            <span className="text-lg">{config.emoji}</span>
            {count > 0 && (
              <span
                className={`
                  text-sm font-medium
                  ${isActive ? "text-white" : "text-white/70"}
                `}
              >
                {count}
              </span>
            )}
            
            {/* Tooltip */}
            <span
              className="
                absolute -top-10 left-1/2 -translate-x-1/2
                px-2 py-1 rounded bg-black/90 text-white text-xs whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
              "
            >
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
