interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-[wave_1.6s_ease-in-out_infinite]",
    none: "",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-white/10 dark:bg-gray-700 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Preset skeleton components
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={14} />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "70%" : "100%"}
          height={14}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              height={16}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonTickerItem() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-300/40 bg-white/95 px-5 py-3 shadow-md md:gap-4 md:rounded-3xl md:px-6 md:py-4 dark:border-slate-700/50 dark:bg-slate-800/95">
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        className="md:h-12 md:w-12"
      />
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width={64} height={16} />
        <Skeleton variant="text" width={80} height={12} />
      </div>
      <Skeleton
        variant="rectangular"
        width={56}
        height={24}
        className="ml-2 rounded-full"
      />
    </div>
  );
}

export function SkeletonMarketCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={120} height={16} />
          </div>
        </div>
        <div className="space-y-2 text-right">
          <Skeleton variant="text" width={96} height={24} />
          <Skeleton variant="text" width={64} height={20} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all dark:border-slate-700 dark:bg-slate-800">
      <Skeleton
        variant="rectangular"
        height={320}
        className="w-full rounded-none"
      />
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          <Skeleton
            variant="rectangular"
            width={80}
            height={24}
            className="rounded-full"
          />
          <Skeleton variant="text" width={128} height={16} />
        </div>
        <Skeleton variant="text" width="100%" height={32} className="mb-3" />
        <Skeleton variant="text" width="75%" height={24} className="mb-4" />
        <div className="mb-6 space-y-2">
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="space-y-1">
              <Skeleton variant="text" width={96} height={16} />
              <Skeleton variant="text" width={80} height={12} />
            </div>
          </div>
          <Skeleton variant="text" width={64} height={16} />
        </div>
      </div>
    </div>
  );
}
