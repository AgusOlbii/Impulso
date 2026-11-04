import { request } from "./api.js";

export const applicationService = {
  async getMyApplication() {
    return await request("/coach-applications/my-application");
  },
};