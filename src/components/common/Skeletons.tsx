import React from 'react';

/**
 * High-fidelity skeleton screens tailored to each app view.
 * Designed with anti-AI-slop visual discipline, matching actual layouts,
 * typography rhythms, and border-radii for zero layout shift.
 */

// Shimmer pulse animation class
const shimmerClass = "animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded";

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Profile Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 overflow-hidden">
            <div className={`h-16 w-full ${shimmerClass} rounded-xl mb-3`} />
            <div className="flex flex-col items-center -mt-9 mb-3">
              <div className={`w-14 h-14 rounded-full ${shimmerClass} ring-4 ring-white dark:ring-slate-900`} />
              <div className={`h-4 w-28 ${shimmerClass} mt-2.5`} />
              <div className={`h-3 w-36 ${shimmerClass} mt-1.5`} />
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              <div className="flex justify-between items-center">
                <div className={`h-3 w-20 ${shimmerClass}`} />
                <div className={`h-3 w-8 ${shimmerClass}`} />
              </div>
              <div className="flex justify-between items-center">
                <div className={`h-3 w-24 ${shimmerClass}`} />
                <div className={`h-3 w-10 ${shimmerClass}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Feed Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          {/* Post composer skeleton */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${shimmerClass} shrink-0`} />
              <div className={`h-10 flex-1 ${shimmerClass} rounded-xl`} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <div className={`h-4 w-16 ${shimmerClass}`} />
                <div className={`h-4 w-16 ${shimmerClass}`} />
                <div className={`h-4 w-16 ${shimmerClass}`} />
              </div>
              <div className={`h-7 w-20 ${shimmerClass} rounded-lg`} />
            </div>
          </div>

          {/* Post Card Skeletons */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${shimmerClass} shrink-0`} />
                <div className="space-y-1.5 flex-1">
                  <div className={`h-4 w-36 ${shimmerClass}`} />
                  <div className={`h-3 w-48 ${shimmerClass}`} />
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className={`h-3.5 w-full ${shimmerClass}`} />
                <div className={`h-3.5 w-[92%] ${shimmerClass}`} />
                <div className={`h-3.5 w-[65%] ${shimmerClass}`} />
              </div>
              {i === 1 && (
                <div className={`h-52 w-full ${shimmerClass} rounded-xl`} />
              )}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className={`h-6 w-16 ${shimmerClass} rounded-md`} />
                <div className={`h-6 w-16 ${shimmerClass} rounded-md`} />
                <div className={`h-6 w-16 ${shimmerClass} rounded-md`} />
                <div className={`h-6 w-16 ${shimmerClass} rounded-md`} />
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
            <div className={`h-4 w-28 ${shimmerClass}`} />
            <div className="space-y-3 pt-1">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-1">
                  <div className={`h-3.5 w-44 ${shimmerClass}`} />
                  <div className={`h-2.5 w-24 ${shimmerClass}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NetworkSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top filter bar skeleton */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
        <div className="flex gap-2">
          <div className={`h-8 w-24 ${shimmerClass} rounded-lg`} />
          <div className={`h-8 w-28 ${shimmerClass} rounded-lg`} />
          <div className={`h-8 w-24 ${shimmerClass} rounded-lg`} />
        </div>
        <div className={`h-8 w-36 ${shimmerClass} rounded-lg`} />
      </div>

      {/* Grid of Connection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-14 h-14 rounded-full ${shimmerClass} shrink-0`} />
              <div className="space-y-2 flex-1 pt-1">
                <div className={`h-4 w-32 ${shimmerClass}`} />
                <div className={`h-3 w-44 ${shimmerClass}`} />
                <div className={`h-2.5 w-20 ${shimmerClass}`} />
              </div>
            </div>
            <div className={`h-3 w-36 ${shimmerClass}`} />
            <div className="flex gap-2 pt-2">
              <div className={`h-8 flex-1 ${shimmerClass} rounded-xl`} />
              <div className={`h-8 w-8 ${shimmerClass} rounded-xl`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const JobsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header filter skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`h-10 flex-1 ${shimmerClass} rounded-xl`} />
          <div className={`h-10 w-full sm:w-48 ${shimmerClass} rounded-xl`} />
          <div className={`h-10 w-full sm:w-32 ${shimmerClass} rounded-xl`} />
        </div>
      </div>

      {/* 2-Column Split View Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-xl ${shimmerClass} shrink-0`} />
                <div className="space-y-1.5 flex-1">
                  <div className={`h-4 w-40 ${shimmerClass}`} />
                  <div className={`h-3 w-28 ${shimmerClass}`} />
                  <div className={`h-3 w-20 ${shimmerClass}`} />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <div className={`h-5 w-16 ${shimmerClass} rounded-md`} />
                <div className={`h-5 w-20 ${shimmerClass} rounded-md`} />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className={`w-16 h-16 rounded-2xl ${shimmerClass}`} />
              <div className="space-y-2">
                <div className={`h-6 w-56 ${shimmerClass}`} />
                <div className={`h-4 w-36 ${shimmerClass}`} />
                <div className={`h-3 w-28 ${shimmerClass}`} />
              </div>
            </div>
            <div className={`h-9 w-28 ${shimmerClass} rounded-xl`} />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            <div className={`h-4 w-32 ${shimmerClass}`} />
            <div className={`h-3.5 w-full ${shimmerClass}`} />
            <div className={`h-3.5 w-[94%] ${shimmerClass}`} />
            <div className={`h-3.5 w-[85%] ${shimmerClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MessagingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden h-[75vh] flex">
        {/* Left conversations list */}
        <div className="w-80 border-r border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
          <div className={`h-9 w-full ${shimmerClass} rounded-xl`} />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                <div className={`w-10 h-10 rounded-full ${shimmerClass} shrink-0`} />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between">
                    <div className={`h-3.5 w-24 ${shimmerClass}`} />
                    <div className={`h-2.5 w-8 ${shimmerClass}`} />
                  </div>
                  <div className={`h-2.5 w-32 ${shimmerClass}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right chat pane */}
        <div className="flex-1 flex flex-col p-6 justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${shimmerClass}`} />
              <div className="space-y-1.5">
                <div className={`h-4 w-32 ${shimmerClass}`} />
                <div className={`h-2.5 w-20 ${shimmerClass}`} />
              </div>
            </div>
            <div className={`h-8 w-24 ${shimmerClass} rounded-lg`} />
          </div>

          <div className="space-y-4 py-6">
            <div className="flex gap-2 max-w-sm">
              <div className={`w-8 h-8 rounded-full ${shimmerClass} shrink-0`} />
              <div className={`h-12 w-64 ${shimmerClass} rounded-2xl`} />
            </div>
            <div className="flex justify-end">
              <div className={`h-14 w-72 ${shimmerClass} rounded-2xl`} />
            </div>
          </div>

          <div className={`h-12 w-full ${shimmerClass} rounded-xl`} />
        </div>
      </div>
    </div>
  );
};

export const AiLabSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex justify-between items-center">
        <div className="space-y-2">
          <div className={`h-6 w-64 ${shimmerClass}`} />
          <div className={`h-3.5 w-96 ${shimmerClass}`} />
        </div>
        <div className={`h-7 w-32 ${shimmerClass} rounded-md`} />
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-9 w-36 ${shimmerClass} rounded-xl`} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <div className={`h-4 w-36 ${shimmerClass}`} />
          <div className={`h-9 w-full ${shimmerClass} rounded-xl`} />
          <div className={`h-20 w-full ${shimmerClass} rounded-xl`} />
          <div className={`h-10 w-full ${shimmerClass} rounded-xl`} />
        </div>
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <div className={`h-4 w-40 ${shimmerClass}`} />
          <div className={`h-24 w-full ${shimmerClass} rounded-xl`} />
          <div className={`h-24 w-full ${shimmerClass} rounded-xl`} />
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className={`h-52 w-full ${shimmerClass}`} />
        <div className="px-8 pb-8 pt-0">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className={`w-32 h-32 rounded-full ${shimmerClass} ring-4 ring-white dark:ring-slate-900`} />
            <div className="flex gap-2">
              <div className={`h-9 w-32 ${shimmerClass} rounded-xl`} />
              <div className={`h-9 w-36 ${shimmerClass} rounded-xl`} />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className={`h-7 w-48 ${shimmerClass}`} />
            <div className={`h-4 w-80 ${shimmerClass}`} />
            <div className={`h-3 w-40 ${shimmerClass}`} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-3">
        <div className={`h-5 w-36 ${shimmerClass}`} />
        <div className={`h-3.5 w-full ${shimmerClass}`} />
        <div className={`h-3.5 w-[85%] ${shimmerClass}`} />
      </div>
    </div>
  );
};

export const CompanySkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className={`h-48 w-full ${shimmerClass} rounded-3xl`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
            <div className={`w-12 h-12 rounded-xl ${shimmerClass}`} />
            <div className={`h-4 w-32 ${shimmerClass}`} />
            <div className={`h-3 w-24 ${shimmerClass}`} />
            <div className={`h-8 w-full ${shimmerClass} rounded-xl mt-2`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-2">
            <div className={`h-3 w-20 ${shimmerClass}`} />
            <div className={`h-7 w-28 ${shimmerClass}`} />
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
        <div className={`h-5 w-48 ${shimmerClass}`} />
        <div className={`h-32 w-full ${shimmerClass} rounded-xl`} />
      </div>
    </div>
  );
};

export const PremiumSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <div className={`h-8 w-64 ${shimmerClass} mx-auto`} />
        <div className={`h-4 w-80 ${shimmerClass} mx-auto`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
            <div className={`h-6 w-32 ${shimmerClass}`} />
            <div className={`h-9 w-24 ${shimmerClass}`} />
            <div className="space-y-2 pt-4">
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className={`h-3.5 w-full ${shimmerClass}`} />
              ))}
            </div>
            <div className={`h-10 w-full ${shimmerClass} rounded-xl mt-6`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ViewSkeleton: React.FC = () => {
  return <FeedSkeleton />;
};
