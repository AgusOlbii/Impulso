import { request } from "./api.js"; 

export const adminService = {

  // Lista pendiente de aplicaciones a profesor
  async getPendingCoachApplications() {
    return await request("/admin/coach-applications");
  },

  // Aprobar solicitud de profesor
  async approveCoachApplication(id) {
    return await request(`/admin/coach-applications/${id}/approve`, {
      method: "PATCH",
    });
  },

  // No aceptar solicitud a profesor
  async rejectCoachApplication(id) {
    return await request(`/admin/coach-applications/${id}/reject`, {
      method: "PATCH",
    });
  },
  removeCoach(id, confirmName) {
    return request(`/admin/coaches/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ confirm_name: confirmName }),
    });
  },
};