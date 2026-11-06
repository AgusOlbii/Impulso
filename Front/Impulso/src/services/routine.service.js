import { request } from "./api.js";

export const routineService = {
  save(payload) {
    return request("/routines", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update(id, payload) {
    return request(`/routines/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  mine() {
    return request("/routines/me");
  },
  latestByStudent(studentId) {
    return request(`/routines/student/${studentId}/latest`);
  },
  byStudent(studentId) {
    return request(`/routines/student/${studentId}`);
  },
  saveProgress(exerciseId, payload) {
    return request(`/routines/exercise/${exerciseId}/progress`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
