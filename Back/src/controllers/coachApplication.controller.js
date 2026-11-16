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

      const existing = await CoachApplicationModel.findByUserId(req.user.id);
      if (existing?.status === "pending") {
        return res.status(409).json({
          ok: false,
          message: "Ya hiciste la solicitud. Esperá la respuesta del administrador.",
        });
      }
      if (existing?.status === "approved") {
        return res.status(409).json({
          ok: false,
          message: "Ya formas parte del equipo de profesores.",
        });
      }

      const applicationId = await CoachApplicationModel.create(validation.data);
      return res.status(201).json({ message: "Solicitud enviada con éxito", id: applicationId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getMyApplicationStatus(req, res) {
    try {
      const userId = req.user.id; 
      console.log("Buscando solicitud para el user_id:", userId);
      
      const application = await CoachApplicationModel.findByUserId(userId);
      console.log("Solicitud encontrada en BD:", application);

      return res.json(application || null);
    } catch (error) {
      console.error("Error al obtener la postulación:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};