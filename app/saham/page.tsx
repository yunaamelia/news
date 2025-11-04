import { Metadata } from "next";
// import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { FiActivity, FiArrowRight, FiClock, FiUser } from "react-icons/fi";
import StockMarketGrid from "../components/market/StockMarketGrid";
import { TOP_IDX_STOCKS } from "../lib/api/stock-data";

export const metadata: Metadata = {
  title: "Berita Saham IDX Terkini - BeritaFinansial",
  description:
    "Baca berita saham terbaru dari Bursa Efek Indonesia (BEI/IDX). Analisis pergerakan IHSG, rekomendasi saham, dan update emiten terkini.",
};

// Force dynamic rendering for real-time stock data
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        category: "SAHAM",
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

export default async function SahamPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-600 mix-blend-multiply blur-[120px] filter" />
        <div className="absolute top-40 right-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-600 mix-blend-multiply blur-[120px] filter delay-500" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="animate-fade-in-up mb-16 text-center">
          <div className="glass-card mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 px-6 py-3 shadow-xl shadow-blue-500/20">
            <FiActivity className="h-5 w-5 text-blue-400" />
            <span className="gradient-text text-sm font-bold">
              Bursa Efek Indonesia
            </span>
          </div>
          <h1 className="mb-6 text-6xl leading-tight font-black md:text-7xl lg:text-8xl">
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Berita Saham
            </span>
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-gray-400 md:text-2xl">
            Ikuti perkembangan terkini pasar saham Indonesia, analisis
            pergerakan IHSG, dan rekomendasi investasi dari para ahli
          </p>
        </div>
      </div>

      {/* Real-time Stock Market Data */}
      <StockMarketGrid
        symbols={TOP_IDX_STOCKS}
        title="Saham Unggulan IDX"
        subtitle="Data real-time dari Yahoo Finance - Update setiap request"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="glass-card animate-fade-in rounded-2xl border border-blue-500/30 p-16 text-center shadow-2xl">
            <FiActivity className="mx-auto mb-4 h-16 w-16 text-blue-400" />
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
                className="group glass-card animate-fade-in-up overflow-hidden rounded-2xl border border-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {article.imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-cyan-600" />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      SAHAM
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

                  <div className="mt-4 inline-flex items-center gap-2 font-bold text-blue-400 transition-all duration-300 group-hover:gap-4">
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
            <button className="hover:shadow-3xl rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
