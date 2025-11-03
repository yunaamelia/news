import { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiClock, FiUser } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Edukasi Investasi & Trading - BeritaFinansial",
  description:
    "Panduan lengkap investasi saham dan kripto untuk pemula hingga advanced. Tutorial, tips, dan strategi trading yang terbukti efektif.",
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
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: "EDUKASI",
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
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching articles:", error);
    }
    return [];
  }
}

export default async function EdukasiPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            <span className="text-amber-600">Edukasi</span> Investasi
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Pelajari cara investasi saham dan kripto dari dasar hingga mahir
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="glass-card animate-fade-in rounded-2xl border border-amber-500/30 p-16 text-center shadow-2xl">
            <FiBookOpen className="mx-auto mb-4 h-16 w-16 text-amber-400" />
            <p className="text-xl font-medium text-gray-400">
              Belum ada artikel untuk kategori ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group glass-card animate-fade-in-up overflow-hidden rounded-2xl border border-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {article.imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-amber-600 to-orange-600" />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 rounded-full bg-linear-to-r from-amber-600 to-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      EDUKASI
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="group-hover:gradient-text mb-3 line-clamp-2 text-xl font-bold text-white transition-all duration-300">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 leading-relaxed text-gray-400">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-gray-500">
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

                  <div className="mt-4 inline-flex items-center gap-2 font-bold text-amber-400 transition-all duration-300 group-hover:gap-4">
                    <span>Baca Selengkapnya</span>
                    <FiArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {articles.length >= 12 && (
          <div className="mt-16 text-center">
            <button className="hover:shadow-3xl rounded-2xl bg-linear-to-r from-amber-600 to-orange-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
