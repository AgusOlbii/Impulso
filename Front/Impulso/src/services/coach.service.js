import { request } from './api.js';

export const coachService = {
  async sendApplication(formData) {
    return await request('/coach-applications', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
  list() {
    return request("/coaches");
  },
  me() {
    return request("/coaches/me");
  },
  updateMe(data) {
    return request("/coaches/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  myStudents() {
    return request("/coaches/me/students");
  },
  hire(coachId) {
    return request("/students/me/coach", {
      method: "PUT",
      body: JSON.stringify({ coach_id: coachId }),
    });
  },
  leave() {
    return request("/students/me/coach", {
      method: "PUT",
      body: JSON.stringify({ coach_id: null }),
    });
  },
};