import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUpload, FaCheckCircle } from "react-icons/fa";
import { createReview } from "../api/reviewApi";

const CROPS = [
  "Wheat", "Rice", "Maize", "Potato", "Tomato",
  "Cotton", "Sugarcane", "Mustard", "Pulses", "Other",
];

const INITIAL_FORM = {
  name: "",
  location: "",
  crop: "",
  review: "",
  image: null,
};

const INITIAL_ERRORS = {
  name: "",
  location: "",
  crop: "",
  review: "",
};

function validate(form) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!form.name.trim()) {
    errors.name = "Please enter your name.";
    valid = false;
  }
  if (!form.location.trim()) {
    errors.location = "Please enter your location or state.";
    valid = false;
  }
  if (!form.crop) {
    errors.crop = "Please select a crop.";
    valid = false;
  }
  if (form.review.trim().length < 20) {
    errors.review = "Review must be at least 20 characters.";
    valid = false;
  }
  if (form.review.length > 500) {
    errors.review = "Review must not exceed 500 characters.";
    valid = false;
  }

  return { errors, valid };
}

const WriteReviewModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setForm((f) => ({ ...f, image: null }));
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const { errors: errs, valid } = validate(form);
    if (!valid) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("location", form.location.trim());
      fd.append("crop", form.crop);
      fd.append("review", form.review.trim());
      if (form.image) fd.append("image", form.image);

      await createReview(fd);
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const mapped = { ...INITIAL_ERRORS };
        for (const key of Object.keys(mapped)) {
          if (data[key]) mapped[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        }
        setErrors(mapped);
        if (data.error) setServerError(data.error);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setSubmitted(false);
    setServerError("");
    setImagePreview(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg
                            max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b
                              border-gray-100 dark:border-gray-700 sticky top-0 bg-white
                              dark:bg-gray-800 z-10 rounded-t-3xl">
                <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                  Write a Review
                </h2>
                <button
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500
                             hover:text-gray-800 dark:hover:text-white hover:bg-gray-100
                             dark:hover:bg-gray-700 transition"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="px-6 pb-6 pt-4">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 py-10 text-center"
                  >
                    <FaCheckCircle className="text-green-500 text-5xl" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Review Published!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                      Your review is now live. Other farmers can see and rate it as helpful.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500
                                 text-white rounded-xl font-semibold hover:from-green-500
                                 hover:to-emerald-400 transition"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {serverError && (
                      <p className="text-sm text-red-600 dark:text-red-400 bg-red-50
                                    dark:bg-red-900/20 px-4 py-2 rounded-xl" role="alert">
                        {serverError}
                      </p>
                    )}

                    {/* Name */}
                    <div>
                      <label htmlFor="rev-name"
                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="rev-name" name="name" type="text"
                        value={form.name} onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar" maxLength={100}
                        aria-invalid={!!errors.name}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700
                                    dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition
                                    ${errors.name ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1" role="alert">{errors.name}</p>}
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="rev-location"
                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location / State <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="rev-location" name="location" type="text"
                        value={form.location} onChange={handleChange}
                        placeholder="e.g. Punjab, India" maxLength={150}
                        aria-invalid={!!errors.location}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700
                                    dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition
                                    ${errors.location ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                      />
                      {errors.location && <p className="text-xs text-red-500 mt-1" role="alert">{errors.location}</p>}
                    </div>

                    {/* Crop */}
                    <div>
                      <label htmlFor="rev-crop"
                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Crop <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="rev-crop" name="crop"
                        value={form.crop} onChange={handleChange}
                        aria-invalid={!!errors.crop}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700
                                    dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition
                                    ${errors.crop ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                      >
                        <option value="">Select a crop…</option>
                        {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.crop && <p className="text-xs text-red-500 mt-1" role="alert">{errors.crop}</p>}
                    </div>

                    {/* Review text */}
                    <div>
                      <label htmlFor="rev-text"
                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Review <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="rev-text" name="review"
                        value={form.review} onChange={handleChange}
                        rows={4} maxLength={500}
                        placeholder="Share your experience using CropCare AI… (min 20 characters)"
                        aria-invalid={!!errors.review}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-700
                                    dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500
                                    transition resize-none
                                    ${errors.review ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.review
                          ? <p className="text-xs text-red-500" role="alert">{errors.review}</p>
                          : <span />}
                        <span className={`text-xs ${form.review.length > 480 ? "text-orange-500" : "text-gray-400 dark:text-gray-500"}`}>
                          {form.review.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Optional image */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Photo <span className="text-gray-400 text-xs font-normal">(optional)</span>
                      </p>
                      {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden max-h-40">
                          <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                          <button type="button" onClick={removeImage} aria-label="Remove image"
                                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60
                                             flex items-center justify-center text-white hover:bg-black/80 transition">
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-2 border-2 border-dashed
                                          border-gray-300 dark:border-gray-600 rounded-xl p-4 cursor-pointer
                                          hover:border-green-400 dark:hover:border-green-500 transition">
                          <FaUpload className="text-gray-400 text-xl" aria-hidden="true" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Click to upload (JPG, PNG, WebP)
                          </span>
                          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                                 onChange={handleImage} className="hidden" />
                        </label>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit" disabled={submitting}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all
                                  flex items-center justify-center gap-2
                                  ${submitting
                                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-green-500/30 transform hover:-translate-y-0.5"}`}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting…
                        </>
                      ) : "Publish Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WriteReviewModal;
