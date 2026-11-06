import { Router } from "express";
import {
  updateCoach,
  getAllCoaches,
  getCoachById,
  getMyStudents,
  getMyCoachProfile,
  updateMyCoachProfile,
} from "../controllers/coach.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createCoachSchema, updateCoachSchema } from "../schemas/coach.schema.js";

const router = Router();
router.use(authenticateToken);
// Ruta para listar todos los profesores (puede ser pública o requerir token según prefieras)
router.get("/search/all", getAllCoaches);
router.get("/me", authorizeRoles("coach"), getMyCoachProfile);
router.patch("/me", authorizeRoles("coach"), validateSchema(updateCoachSchema), updateMyCoachProfile);
router.get("/students", authorizeRoles("coach"), getMyStudents);

// Ruta para traer un solo profesor
router.get("/:id/search", getCoachById);

//Ruta para actualizar datos del profesor
router.put("/:id/update", authorizeRoles("coach", "admin"), validateSchema(createCoachSchema), updateCoach);

export default router;