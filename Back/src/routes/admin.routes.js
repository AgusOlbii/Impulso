import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/auth.js";

const router = Router();


router.get("/coach-applications", authenticateToken, authorizeRoles("admin"), adminController.getPendingApplications);

router.patch("/coach-applications/:id/approve", authenticateToken, authorizeRoles("admin"), adminController.approveApplication);

export default router;