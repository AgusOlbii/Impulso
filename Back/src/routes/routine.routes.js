import { Router } from "express";
import { createRoutine, getRoutineById, getStudentRoutines, logProgress, deleteRoutine } from "../controllers/routine.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createRoutineSchema } from "../schemas/routine.schema.js";

const router = Router();

// 1. Todas estas rutas exigen que el usuario haya iniciado sesión
router.use(authenticateToken);

// Solo los usuarios con rol de coach y admin pueden crear rutinas
router.post("/", authorizeRoles("admin", "coach"), validateSchema(createRoutineSchema), createRoutine);

//Rutas accesibles por alumnos o coaches 
router.get("/student/:studentId", getStudentRoutines);

router.get("/:id", getRoutineById);

router.patch("/exercise/:exerciseId/progress", logProgress); // El alumno registra su progreso

router.delete("/:id", authorizeRoles("admin", "coach"), deleteRoutine); // Solo el coach borra rutinas

export default router;