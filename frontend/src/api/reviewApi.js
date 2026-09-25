import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

/** GET /api/reviews/?sort=recent&crop=Wheat&page=1&limit=12 */
export const getReviews = ({ sort = "recent", crop = "", page = 1, limit = 12 } = {}) => {
  const params = { sort, page, limit };
  if (crop) params.crop = crop;
  return API.get("/reviews/", { params });
};

/** POST /api/reviews/  (multipart/form-data for optional image) */
export const createReview = (formData) =>
  API.post("/reviews/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** DELETE /api/reviews/:id/ */
export const deleteReview = (id) => API.delete(`/reviews/${id}/`);

/** POST /api/reviews/:id/helpful/  — toggle helpful vote */
export const toggleHelpful = (id) => API.post(`/reviews/${id}/helpful/`);
