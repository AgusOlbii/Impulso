import { Router } from "express";
import {
  listCoaches,
  getMyCoachProfile,
  updateMyCoachProfile,
  getMyStudents,
} from "../controllers/coach.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticateToken, listCoaches);
router.get("/me", authenticateToken, authorizeRoles("coach"), getMyCoachProfile);
router.patch("/me", authenticateToken, authorizeRoles("coach"), updateMyCoachProfile);
router.get("/me/students", authenticateToken, authorizeRoles("coach"), getMyStudents);

export default router;
