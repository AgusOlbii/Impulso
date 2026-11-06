import { Router } from "express";
import {
  getMyStudentRoutine,
  getStudentRoutineForCoach,
  saveStudentRoutine,
  logMyExerciseProgress,
} from "../controllers/routine.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/me", authenticateToken, authorizeRoles("student"), getMyStudentRoutine);
router.patch(
  "/exercises/:id",
  authenticateToken,
  authorizeRoles("student"),
  logMyExerciseProgress
);
router.get(
  "/student/:studentId",
  authenticateToken,
  authorizeRoles("coach"),
  getStudentRoutineForCoach
);
router.post("/", authenticateToken, authorizeRoles("coach"), saveStudentRoutine);

export default router;
