import React from 'react';

export const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-4 md:mt-12 px-2 md:px-4 animate-pulse">
      {/* Current Weather Skeleton */}
      <div className="glass-card p-4 md:p-10 mb-4 md:mb-8 h-auto md:h-80 w-full flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/2">
          <div className="h-8 md:h-10 bg-black/10 dark:bg-white/10 rounded-lg w-3/4 mb-3 md:mb-4"></div>
          <div className="h-4 md:h-6 bg-black/10 dark:bg-white/10 rounded-lg w-1/3 mb-6 md:mb-10"></div>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-black/10 dark:bg-white/10 rounded-full"></div>
            <div className="h-12 md:h-16 bg-black/10 dark:bg-white/10 rounded-lg w-24 md:w-32"></div>
          </div>
        </div>
        <div className="w-full md:w-1/3 grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 md:h-20 bg-black/10 dark:bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-8">
          <div className="glass-card h-[250px] md:h-[400px] p-4 md:p-6">
            <div className="h-6 md:h-8 bg-black/10 dark:bg-white/10 rounded-lg w-1/4 mb-4 md:mb-8"></div>
            <div className="h-32 md:h-64 bg-black/10 dark:bg-white/10 rounded-lg w-full"></div>
          </div>
        </div>
        <div className="pt-0 md:pt-2">
          <div className="h-6 md:h-8 bg-black/10 dark:bg-white/10 rounded-lg w-1/2 mb-4 md:mb-6 ml-2"></div>
          <div className="space-y-2 md:space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-10 md:h-14 bg-black/10 dark:bg-white/10 rounded-xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
