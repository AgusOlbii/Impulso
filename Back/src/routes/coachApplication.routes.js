import { Router } from "express";
import { coachApplicationController } from "../controllers/coachApplication.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();
// Cualquier usuario autenticado puede enviar su solicitud
router.post("/", authenticateToken, authorizeRoles("student"), coachApplicationController.create);

export default router;