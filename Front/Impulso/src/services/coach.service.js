import { request } from './api.js';

export const coachService = {
  async sendApplication(formData) {
    return await request('/coach-applications', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
};