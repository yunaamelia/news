import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FiClock,
  FiUser,
  FiTag,
  FiShare2,
  FiBookmark,
  FiArrowLeft,
} from "react-icons/fi";
import prisma from "@/app/lib/prisma";

export const revalidate = 300; // ISR: revalidate every 5 minutes
export const dynamicParams = true; // Generate pages on-demand

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      take: 20,
    });

    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

async function getArticle(slug: string) {
  return await prisma.article.findUnique({
    where: { slug },
    include: {
      comments: {
        select: { id: true },
      },
    },
  });
}

async function getRelatedArticles(category: string, currentId: string) {
  return await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      category: category as "SAHAM" | "KRIPTO" | "ANALISIS" | "EDUKASI" | "REGULASI" | "TEKNOLOGI",
      NOT: { id: currentId },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      category: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== "PUBLISHED") {
    return {
      title: "Artikel Tidak Ditemukan - BeritaFinansial",
    };
  }

  return {
    title: `${article.title} - BeritaFinansial`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
    },
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, article.id);

  const categoryColors: Record<string, string> = {
    SAHAM: "blue",
    KRIPTO: "purple",
    ANALISIS: "green",
    EDUKASI: "amber",
    REGULASI: "red",
    TEKNOLOGI: "indigo",
  };

  const categoryColor = categoryColors[article.category] || "gray";

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Kembali ke Artikel</span>
        </Link>

        {/* Category Badge */}
        <div className="mb-6">
          <span
            className={`inline-block px-4 py-2 bg-${categoryColor}-100 text-${categoryColor}-700 rounded-lg text-sm font-semibold`}
          >
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {article.authorImage && (
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-sm">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">
                  {article.author || "Admin"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FiClock className="w-4 h-4" />
                <time dateTime={article.publishedAt?.toISOString()}>
                  {article.publishedAt && new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <FiBookmark className="w-5 h-5" />
              <span className="text-sm font-semibold">Simpan</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <FiShare2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Bagikan</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
            <div className="aspect-video w-full" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <FiTag className="w-5 h-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                {article.category.toLowerCase()}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                investasi
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                finansial
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/artikel/${related.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {related.coverImage && (
                  <div className="aspect-video bg-linear-to-br from-gray-200 to-gray-300" />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {related.excerpt}
                  </p>
                  <time className="text-xs text-gray-500">
                    {related.publishedAt && new Date(related.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
