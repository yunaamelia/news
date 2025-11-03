export default function ArtikelLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-8 animate-pulse" />

        {/* Category Badge Skeleton */}
        <div className="h-8 w-24 bg-gray-200 rounded-lg mb-6 animate-pulse" />

        {/* Title Skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>

        {/* Meta Info Skeleton */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="aspect-video bg-gray-200 rounded-2xl mb-10 animate-pulse" />

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      </article>
    </div>
  );
}
