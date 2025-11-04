"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  targetUserId,
  initialFollowing = false,
  onFollowChange,
}: FollowButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    // Redirect to signin if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/follow?userId=${targetUserId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to unfollow");
        }

        setIsFollowing(false);
        onFollowChange?.(false);
      } else {
        // Follow
        const response = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: targetUserId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to follow");
        }

        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading || status === "loading"}
      variant={isFollowing ? "outline" : "primary"}
      className="min-w-[100px]"
    >
      {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
