import { request } from "./api.js";

export const routineService = {
  mine() {
    return request("/routines/me");
  },
  byStudent(studentId) {
    return request(`/routines/student/${studentId}`);
  },
  save(payload) {
    return request("/routines", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logProgress(exerciseId, payload) {
    return request(`/routines/exercises/${exerciseId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
