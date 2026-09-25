import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaPen, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { getReviews } from "../api/reviewApi";
import ReviewCard from "./ReviewCard";
import WriteReviewModal from "./WriteReviewModal";
import { useAuth } from "../context/AuthContext";

const CROPS = [
  "All Crops", "Wheat", "Rice", "Maize", "Potato", "Tomato",
  "Cotton", "Sugarcane", "Mustard", "Pulses", "Other",
];

const SORT_OPTIONS = [
  { value: "recent",  label: "Most Recent" },
  { value: "oldest",  label: "Oldest" },
  { value: "helpful", label: "Most Helpful" },
];

const LIMIT = 12;

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border
                    border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  );
}

const ReviewsPage = () => {
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews]       = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage]             = useState(1);
  const [sort, setSort]             = useState("recent");
  const [crop, setCrop]             = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [modalOpen, setModalOpen]   = useState(false);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    setError("");
    getReviews({ sort, crop, page, limit: LIMIT })
      .then((res) => {
        setReviews(res.data.results);
        setTotalPages(res.data.total_pages);
        setTotalCount(res.data.total);
      })
      .catch(() => setError("Failed to load reviews. Please try again."))
      .finally(() => setLoading(false));
  }, [sort, crop, page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSort = (val) => { setSort(val); setPage(1); };
  const handleCrop = (val) => { setCrop(val === "All Crops" ? "" : val); setPage(1); };

  // After new review submitted — jump to top, sort by recent, refresh
  const handleReviewSuccess = () => {
    setSort("recent");
    setCrop("");
    setPage(1);
    fetchReviews();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-green-400/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-emerald-600/20 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30
                            text-green-700 dark:text-green-300 font-semibold text-sm mb-5
                            border border-green-200 dark:border-green-800">
              🌾 Community Voices
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white
                           mb-4 leading-tight tracking-tight">
              Farmer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">
                Reviews
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-light">
              Real experiences from farmers using CropCare AI. Mark reviews as helpful to surface the best ones.
            </p>

            {isAuthenticated ? (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r
                           from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400
                           text-white rounded-xl shadow-lg shadow-green-500/30 font-semibold
                           transition-all transform hover:-translate-y-0.5"
              >
                <FaPen aria-hidden="true" /> Write a Review
              </button>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <a href="/login" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                  Log in
                </a>{" "}
                to write a review or mark reviews as helpful.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-20 space-y-6 max-w-5xl">

        {/* Stats bar */}
        {!loading && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                       dark:border-gray-700 px-6 py-4 flex items-center gap-3"
          >
            <span className="text-3xl font-extrabold text-green-600 dark:text-green-400">
              {totalCount}
            </span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {totalCount === 1 ? "review" : "reviews"} from farmers across India
            </span>
          </motion.div>
        )}

        {/* Filter / sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FaFilter className="text-green-500 flex-shrink-0" aria-hidden="true" />
            <select
              value={crop || "All Crops"}
              onChange={(e) => handleCrop(e.target.value)}
              aria-label="Filter by crop"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <FaSortAmountDown className="text-green-500" aria-hidden="true" />
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              aria-label="Sort reviews"
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center py-4" role="alert">{error}</p>
        )}

        {/* Review grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-lg font-medium">No reviews yet</p>
            <p className="text-sm mt-1">
              {isAuthenticated
                ? "Be the first to share your experience!"
                : "Log in to be the first to leave a review."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} onHelpfulToggle={fetchReviews} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <nav className="flex items-center justify-center gap-2 pt-4" aria-label="Review pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300
                         hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "…" ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    aria-current={page === item ? "page" : undefined}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition
                                ${page === item
                                  ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow"
                                  : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-green-400"}`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300
                         hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </nav>
        )}
      </div>

      <WriteReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default ReviewsPage;
