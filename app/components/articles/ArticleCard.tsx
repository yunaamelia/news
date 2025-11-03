import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/types";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
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
            <span>{article.author}</span>
            <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
