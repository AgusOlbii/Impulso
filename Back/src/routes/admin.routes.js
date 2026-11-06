import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// Trae la lista de aplicaciones pendientess
router.get("/coach-applications", authenticateToken, authorizeRoles("admin"), adminController.getPendingApplications);
// Aprueba la solicitud
router.patch("/coach-applications/:id/approve", authenticateToken, authorizeRoles("admin"), adminController.approveApplication);
// Rechaza la solicitud
router.patch("/coach-applications/:id/reject", authenticateToken, authorizeRoles("admin"), adminController.rejectApplication);
router.delete("/coaches/:id", authenticateToken, authorizeRoles("admin"), adminController.removeCoach);

export default router;