import { CoachApplicationModel } from "../models/coachApplication.model.js";
import { createCoachApplicationSchema } from "../schemas/coachApplication.schema.js";

export const coachApplicationController = {
  async create(req, res) {
    try {
      const payload = { ...req.body, user_id: req.user.id };

      const validation = createCoachApplicationSchema.safeParse(payload);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const applicationId = await CoachApplicationModel.create(validation.data);
      return res.status(201).json({ message: "Solicitud enviada con éxito", id: applicationId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};