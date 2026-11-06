import { request } from "./api.js";

export const reviewService = {
  mine() {
    return request("/reviews/me");
  },
  save(payload) {
    return request("/reviews/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
