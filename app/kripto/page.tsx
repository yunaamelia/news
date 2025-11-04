// import prisma from "@/app/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiClock, FiTrendingUp, FiUser } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Berita Cryptocurrency Terkini - BeritaFinansial",
  description:
    "Update terbaru seputar Bitcoin, Ethereum, dan cryptocurrency lainnya. Analisis pasar kripto, regulasi, dan tren teknologi blockchain.",
};

export const revalidate = 300;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  publishedAt: string;
  author: { name: string } | null;
}

async function getArticles(): Promise<Article[]> {
  try {
    return [];
    /* const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: "KRIPTO",
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: true,
      },
    });

    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      imageUrl: a.coverImage ?? null,
      publishedAt: a.publishedAt?.toISOString() ?? new Date().toISOString(),
      author: a.author ? { name: a.author } : null,
    })); */
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching articles:", error);
    }
    return [];
  }
}

export default async function KriptoPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600 mix-blend-multiply blur-[120px] filter" />
        <div className="absolute top-40 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-600 mix-blend-multiply blur-[120px] filter delay-700" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="animate-fade-in-up mb-16 text-center">
          <div className="glass-card mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 px-6 py-3 shadow-xl shadow-purple-500/20">
            <FiTrendingUp className="h-5 w-5 animate-pulse text-purple-400" />
            <span className="gradient-text text-sm font-bold">
              Blockchain & Cryptocurrency
            </span>
          </div>
          <h1 className="mb-6 text-6xl leading-tight font-black md:text-7xl lg:text-8xl">
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Berita Kripto
            </span>
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-gray-400 md:text-2xl">
            Dapatkan informasi terkini tentang Bitcoin, Ethereum, dan kripto
            lainnya. Analisis pasar, regulasi, dan perkembangan teknologi
            blockchain
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="glass-card animate-fade-in rounded-2xl border border-purple-500/30 p-16 text-center shadow-2xl">
            <FiTrendingUp className="mx-auto mb-4 h-16 w-16 text-purple-400" />
            <p className="text-xl font-medium text-gray-400">
              Belum ada artikel untuk kategori ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {article.imageUrl && (
                  <div className="relative aspect-video overflow-hidden bg-linear-to-br from-purple-500 to-pink-600">
                    <div className="absolute top-4 left-4 rounded-lg bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                      KRIPTO
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-600">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-gray-600">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-4 w-4" />
                      <span>{article.author?.name || "Admin"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="h-4 w-4" />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 font-bold text-purple-400 transition-all duration-300 group-hover:gap-4">
                    <span>Baca Selengkapnya</span>
                    <FiArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {articles.length >= 12 && (
          <div className="mt-16 text-center">
            <button className="hover:shadow-3xl rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
