import React from 'react';

export const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4 animate-pulse">
      {/* Current Weather Skeleton */}
      <div className="glass-card p-10 mb-8 h-64 md:h-80 w-full flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/2">
          <div className="h-10 bg-gray-300 dark:bg-gray-700/50 rounded-lg w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700/50 rounded-lg w-1/3 mb-10"></div>
          <div className="flex gap-4 items-center">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700/50 rounded-full"></div>
            <div className="h-16 bg-gray-300 dark:bg-gray-700/50 rounded-lg w-32"></div>
          </div>
        </div>
        <div className="w-full md:w-1/3 grid grid-cols-2 gap-4 mt-8 md:mt-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700/50 rounded-xl"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2 glass-card h-[400px] p-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-700/50 rounded-lg w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-700/50 rounded-lg w-full"></div>
        </div>
        {/* Forecast Skeleton */}
        <div className="pt-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-700/50 rounded-lg w-1/2 mb-6 ml-2"></div>
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-300 dark:bg-gray-700/50 rounded-xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
