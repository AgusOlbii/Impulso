import { request } from './api.js';

export const coachService = {
  async sendApplication(formData) {
    return await request('/coach-applications', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
  list() {
    return request("/coach/search/all");
  },
  me() {
    return request("/coach/me");
  },
  updateMe(data) {
    return request("/coach/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  myStudents() {
    return request("/coach/students");
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
  saveStudentNote(studentId, coachNote) {
    return request(`/students/${studentId}/note`, {
      method: "PUT",
      body: JSON.stringify({ coach_note: coachNote }),
    });
  },
};