"use client";

import { Article } from "@/app/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  onBookmarkRemoved?: () => void;
}

export default function ArticleGrid({
  articles,
  onBookmarkRemoved,
}: ArticleGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 0.1s delay between each card
        delayChildren: 0.2,
      },
    },
  };

  // Individual card animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: [0.4, 0, 0.2, 1] as any,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={itemVariants}>
          <ArticleCard
            article={article}
            onBookmarkRemoved={onBookmarkRemoved}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
