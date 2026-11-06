import { Router } from "express";
import { createRoutine, getRoutineById, getStudentRoutines, logProgress, deleteRoutine, getMyRoutine, getLatestStudentRoutine, updateRoutine } from "../controllers/routine.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createRoutineSchema, updateRoutineSchema } from "../schemas/routine.schema.js";
import { logStudentProgressSchema } from "../schemas/routine_exercise.schema.js";

const router = Router();

// 1. Todas estas rutas exigen que el usuario haya iniciado sesión
router.use(authenticateToken);

// Solo los usuarios con rol de coach y admin pueden crear rutinas
router.post("/", authorizeRoles("admin", "coach"), validateSchema(createRoutineSchema), createRoutine);

router.get("/me", authorizeRoles("student"), getMyRoutine);
router.get("/student/:studentId/latest", getLatestStudentRoutine);
router.get("/student/:studentId", getStudentRoutines);

router.put("/:id", authorizeRoles("admin", "coach"), validateSchema(updateRoutineSchema), updateRoutine);
router.get("/:id", getRoutineById);

router.patch("/exercise/:exerciseId/progress", authorizeRoles("student"), validateSchema(logStudentProgressSchema), logProgress);

router.delete("/:id", authorizeRoles("admin", "coach"), deleteRoutine); // Solo el coach borra rutinas

export default router;