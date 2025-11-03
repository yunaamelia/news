import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiClock, FiUser } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Berita Saham IDX Terkini - BeritaFinansial",
  description:
    "Baca berita saham terbaru dari Bursa Efek Indonesia (BEI/IDX). Analisis pergerakan IHSG, rekomendasi saham, dan update emiten terkini.",
};

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/articles?category=SAHAM&limit=12`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function SahamPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Berita <span className="text-blue-600">Saham</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ikuti perkembangan terkini pasar saham Indonesia, analisis pergerakan IHSG,
            dan rekomendasi investasi dari para ahli
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-lg text-gray-600">
              Belum ada artikel untuk kategori ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {article.imageUrl && (
                  <div className="aspect-video bg-linear-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      SAHAM
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      <span>{article.author?.name || "Admin"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Baca Selengkapnya</span>
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {articles.length >= 12 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
