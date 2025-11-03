import { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiClock, FiShield, FiUser } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Regulasi & Kebijakan Finansial - BeritaFinansial",
  description:
    "Update regulasi terbaru di pasar modal dan cryptocurrency. Kebijakan OJK, BI, dan regulator global yang mempengaruhi investasi Anda.",
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
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/articles?category=REGULASI&limit=12`,
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

export default async function RegulasiPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-1/4 h-96 w-96 animate-pulse rounded-full bg-red-600 mix-blend-multiply blur-[120px] filter" />
        <div className="absolute top-40 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-600 mix-blend-multiply blur-[120px] filter delay-500" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-16 text-center">
          <div className="glass-card mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 px-6 py-3 shadow-xl shadow-red-500/20">
            <FiShield className="h-5 w-5 text-red-400" />
            <span className="gradient-text text-sm font-bold">
              Kebijakan & Peraturan
            </span>
          </div>
          <h1 className="mb-6 text-6xl leading-tight font-black md:text-7xl lg:text-8xl">
            <span className="bg-linear-to-r from-red-400 via-pink-400 to-red-500 bg-clip-text text-transparent">
              Regulasi Terbaru
            </span>
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-gray-400 md:text-2xl">
            Pantau perkembangan regulasi pasar modal dan kripto untuk investasi
            yang aman
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="glass-card animate-fade-in rounded-2xl border border-red-500/30 p-16 text-center shadow-2xl">
            <FiShield className="mx-auto mb-4 h-16 w-16 text-red-400" />
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
                className="group glass-card animate-fade-in-up overflow-hidden rounded-2xl border border-red-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-red-400/50 hover:shadow-2xl hover:shadow-red-500/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {article.imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-red-600 to-pink-600" />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 rounded-full bg-linear-to-r from-red-600 to-pink-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      REGULASI
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

                  <div className="mt-4 inline-flex items-center gap-2 font-bold text-red-400 transition-all duration-300 group-hover:gap-4">
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
            <button className="hover:shadow-3xl rounded-2xl bg-linear-to-r from-red-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
