import { request } from "./api.js";

export const exerciseService = {
  list() {
    return request("/exercise");
  },
  create(payload) {
    return request("/exercise", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  remove(id) {
    return request(`/exercise/${id}`, {
      method: "DELETE",
    });
  },
};
