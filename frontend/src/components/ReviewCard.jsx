import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaSeedling, FaThumbsUp } from "react-icons/fa";
import { toggleHelpful } from "../api/reviewApi";
import { useAuth } from "../context/AuthContext";

const BACKEND = "http://127.0.0.1:8000";

// Deterministic avatar colour from name initial
const AVATAR_COLOURS = [
  "from-green-500 to-emerald-400",
  "from-teal-500 to-cyan-400",
  "from-lime-500 to-green-400",
  "from-emerald-600 to-teal-500",
  "from-cyan-500 to-blue-400",
];
function avatarGradient(name = "") {
  const code = (name.charCodeAt(0) || 0) % AVATAR_COLOURS.length;
  return AVATAR_COLOURS[code];
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ReviewCard = ({ review, index = 0, onHelpfulToggle }) => {
  const { isAuthenticated } = useAuth();
  const { id, name, location, crop, review: text, image, helpful_count, has_voted, created_at } = review;

  const [count, setCount] = useState(helpful_count ?? 0);
  const [voted, setVoted] = useState(has_voted ?? false);
  const [loading, setLoading] = useState(false);

  const imageUrl = image
    ? image.startsWith("http") ? image : `${BACKEND}${image}`
    : null;

  const handleHelpful = async () => {
    if (!isAuthenticated || loading) return;
    setLoading(true);
    try {
      const res = await toggleHelpful(id);
      setCount(res.data.helpful_count);
      setVoted(res.data.has_voted);
      onHelpfulToggle?.();
    } catch {
      // silent — user sees no change
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4"
    >
      {/* Header — avatar + name + meta */}
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient(name)}
                      flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow`}
          aria-hidden="true"
        >
          {(name || "F")[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{name}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
            {location && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-green-500" aria-hidden="true" />
                {location}
              </span>
            )}
            {crop && (
              <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400
                               bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-medium">
                <FaSeedling aria-hidden="true" />
                {crop}
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        {created_at && (
          <time dateTime={created_at} className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            {formatDate(created_at)}
          </time>
        )}
      </div>

      {/* Review text */}
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        {text}
      </p>

      {/* Optional image */}
      {imageUrl && (
        <div className="rounded-xl overflow-hidden max-h-52">
          <img
            src={imageUrl}
            alt={`Photo shared by ${name}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Footer — helpful button */}
      <div className="flex items-center justify-end pt-1 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleHelpful}
          disabled={!isAuthenticated || loading}
          aria-label={voted ? "Remove helpful vote" : "Mark as helpful"}
          aria-pressed={voted}
          title={!isAuthenticated ? "Log in to vote" : voted ? "Remove vote" : "Mark as helpful"}
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl transition-all
                      ${voted
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                      ${!isAuthenticated ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                      ${loading ? "opacity-60" : ""}`}
        >
          <FaThumbsUp
            className={voted ? "text-green-600 dark:text-green-400" : "text-gray-400"}
            aria-hidden="true"
          />
          <span>Helpful</span>
          {count > 0 && (
            <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                             text-xs font-bold px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>
    </motion.article>
  );
};

export default ReviewCard;
