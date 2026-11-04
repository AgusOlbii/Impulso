import { Router } from "express";
import { createReview, getReviewsByCoach, deleteReview } from "../controllers/review.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createReviewSchema } from "../schemas/review.schema.js";

const router = Router();



// Rutas protegidas
router.use(authenticateToken);

// Obtener las reseñas de un profesor es público
router.get("/coach/:coach_id", getReviewsByCoach);

// Crear una reseña
router.post("/", authorizeRoles("student", "admin"), validateSchema(createReviewSchema), createReview);

// Eliminar una reseña (Estudiante creador, o admin)
router.delete("/:id", authorizeRoles("student", "admin"), deleteReview);

export default router;