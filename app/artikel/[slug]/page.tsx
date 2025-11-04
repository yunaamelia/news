import prisma from "@/app/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiBookmark,
  FiClock,
  FiShare2,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { ReactionButtons } from "@/app/components/social/ReactionButtons";

export const revalidate = 300; // ISR: revalidate every 5 minutes
export const dynamic = "force-dynamic"; // Always render dynamically
export const dynamicParams = true; // Generate pages on-demand

// Disabled generateStaticParams to prevent build-time database connections
// Pages will be generated on-demand instead
// export async function generateStaticParams() {
//   try {
//     const articles = await prisma.article.findMany({
//       where: { status: "PUBLISHED" },
//       select: { slug: true },
//       take: 20,
//     });

//     return articles.map((article) => ({
//       slug: article.slug,
//     }));
//   } catch (error) {
//     console.error("Error in generateStaticParams:", error);
//     return [];
//   }
// }

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
      category: category as
        | "SAHAM"
        | "KRIPTO"
        | "ANALISIS"
        | "EDUKASI"
        | "REGULASI"
        | "TEKNOLOGI",
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

  const relatedArticles = await getRelatedArticles(
    article.category,
    article.id
  );

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
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/artikel"
          className="mb-8 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-blue-600"
        >
          <FiArrowLeft className="h-5 w-5" />
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
        <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3">
            {article.authorImage && (
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-full bg-linear-to-br from-blue-500 to-purple-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-sm">
                <FiUser className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-900">
                  {article.author || "Admin"}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <FiClock className="h-4 w-4" />
                <time dateTime={article.publishedAt?.toISOString()}>
                  {article.publishedAt &&
                    new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                </time>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600">
              <FiBookmark className="h-5 w-5" />
              <span className="text-sm font-semibold">Simpan</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600">
              <FiShare2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Bagikan</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="mb-10 overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-200">
            <div className="aspect-video w-full" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Reactions */}
        <div className="mt-10 border-t border-gray-200 pt-8">
          <p className="mb-4 text-sm font-semibold text-gray-700">
            Bagaimana menurut Anda tentang artikel ini?
          </p>
          <ReactionButtons articleSlug={article.slug} />
        </div>

        {/* Tags */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-3">
            <FiTag className="h-5 w-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {article.category.toLowerCase()}
              </span>
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                investasi
              </span>
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                finansial
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/artikel/${related.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
              >
                {related.coverImage && (
                  <div className="aspect-video bg-linear-to-br from-gray-200 to-gray-300" />
                )}
                <div className="p-6">
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {related.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {related.excerpt}
                  </p>
                  <time className="text-xs text-gray-500">
                    {related.publishedAt &&
                      new Date(related.publishedAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
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
