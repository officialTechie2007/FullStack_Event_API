const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-3 border-[var(--border-color)] border-t-[var(--color-primary)] rounded-full animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-[var(--text-muted)] animate-pulse">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 space-y-4">
    <div className="skeleton h-6 w-3/4 rounded" />
    <div className="skeleton h-4 w-1/2 rounded" />
    <div className="skeleton h-4 w-full rounded" />
    <div className="skeleton h-10 w-1/3 rounded-lg" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    <div className="skeleton h-12 w-full rounded-lg" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-14 w-full rounded-lg" />
    ))}
  </div>
);

export default Spinner;
