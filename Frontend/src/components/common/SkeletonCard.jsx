const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
    <div className="skeleton aspect-square w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded-full" />
      <div className="skeleton h-3 w-full rounded-full" />
      <div className="skeleton h-3 w-2/3 rounded-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;