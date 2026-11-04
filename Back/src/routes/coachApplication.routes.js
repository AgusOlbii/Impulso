import { Router } from "express";
import { coachApplicationController } from "../controllers/coachApplication.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();
// Enviar solicitud para aplicar como profesor
router.post("/", authenticateToken, authorizeRoles("student"), coachApplicationController.create);
// Enviar datos al front el estado de la solicitud (rejected, pending, aprovved)
router.get("/my-application", authenticateToken, authorizeRoles("student"), coachApplicationController.getMyApplicationStatus);

export default router;