import React from "react";
import { FaStar } from "react-icons/fa";

function StarDisplay({ value }) {
  return (
    <div className="flex gap-0.5" aria-label={`Average rating ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          size={20}
          className={
            s <= Math.round(value)
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function BarRow({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-gray-700 dark:text-gray-300 font-medium">
        {star}
      </span>
      <FaStar size={12} className="text-yellow-400 flex-shrink-0" aria-hidden="true" />
      <div
        className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${star} star — ${pct}%`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-gray-500 dark:text-gray-400 text-right">
        {count}
      </span>
    </div>
  );
}

const RatingSummary = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                      dark:border-gray-700 p-6 h-40" aria-hidden="true" />
    );
  }

  const { total = 0, average = 0, stars = {} } = summary || {};

  return (
    <section
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                 dark:border-gray-700 shadow-sm p-6 flex flex-col sm:flex-row gap-6"
      aria-label="Rating summary"
    >
      {/* Left — big average */}
      <div className="flex flex-col items-center justify-center sm:w-36 flex-shrink-0 gap-2">
        <span className="text-6xl font-extrabold text-gray-900 dark:text-white leading-none">
          {average.toFixed(1)}
        </span>
        <StarDisplay value={average} />
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {total.toLocaleString()} {total === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-gray-100 dark:bg-gray-700 self-stretch" aria-hidden="true" />

      {/* Right — star breakdown bars */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        {[5, 4, 3, 2, 1].map((s) => (
          <BarRow
            key={s}
            star={s}
            count={stars[String(s)] ?? 0}
            total={total}
          />
        ))}
      </div>
    </section>
  );
};

export default RatingSummary;
