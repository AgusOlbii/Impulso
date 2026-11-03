import { request } from "./api.js"; // O apiFetch, según cómo lo tengas en tu api.js

export const adminService = {
  async getPendingCoachApplications() {
    return await request("/admin/coach-applications");
  },

  async approveCoachApplication(id) {
    return await request(`/admin/coach-applications/${id}/approve`, {
      method: "PATCH",
    });
  },
};