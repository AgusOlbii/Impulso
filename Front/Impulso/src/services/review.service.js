import { request } from "./api.js";

export const reviewService = {
  mine(coachId) {
    return request(`/reviews/mine/${coachId}`);
  },
  save({ coachId, rating, comment }) {
    return request("/reviews", {
      method: "POST",
      body: JSON.stringify({
        coach_id: Number(coachId),
        rating: Number(rating),
        comment: comment || "",
      }),
    });
  },
};
