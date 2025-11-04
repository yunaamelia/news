"use client";

import { useState } from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import {
  FiCheck,
  FiCopy,
  FiFacebook,
  FiLinkedin,
  FiShare2,
  FiTwitter,
} from "react-icons/fi";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function ShareButton({
  url,
  title,
  description,
  size = "md",
  showText = false,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Check Web Share API availability using lazy initialization
  const [canUseWebShare] = useState(() => {
    return typeof navigator !== "undefined" && "share" in navigator;
  });

  const fullUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_SITE_URL}${url}`;

  const shareLinks = [
    {
      name: "Twitter",
      icon: FiTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        fullUrl
      )}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "Facebook",
      icon: FiFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
      color: "hover:bg-green-500 hover:text-white",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-sky-400 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleWebShare = async () => {
    try {
      await navigator.share({
        title,
        text: description || title,
        url: fullUrl,
      });
      setIsOpen(false);
    } catch (error) {
      // User cancelled or error occurred
      console.log("Share cancelled or failed:", error);
    }
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
    setIsOpen(false);
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg bg-gray-100 text-gray-600 transition-all hover:scale-105 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 ${sizeClasses[size]} `}
        title="Bagikan artikel"
      >
        <FiShare2 className={iconSizeClasses[size]} />
        {showText && <span className="text-sm font-medium">Bagikan</span>}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Share menu */}
          <div className="absolute right-0 z-50 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-1">
              {/* Web Share API (if available) */}
              {canUseWebShare && (
                <>
                  <button
                    onClick={handleWebShare}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-purple-500 hover:text-white dark:text-gray-300"
                  >
                    <FiShare2 className="h-5 w-5" />
                    <span className="font-medium">Share via...</span>
                  </button>
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                </>
              )}

              {shareLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleShare(link.url)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all dark:text-gray-300 ${link.color} `}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.name}</span>
                </button>
              ))}

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={handleCopyLink}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  copied
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                } `}
              >
                {copied ? (
                  <>
                    <FiCheck className="h-5 w-5" />
                    <span className="font-medium">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="h-5 w-5" />
                    <span className="font-medium">Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
