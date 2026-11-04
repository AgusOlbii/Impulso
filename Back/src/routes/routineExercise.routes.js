import { Router } from "express";
import { 
    addExerciseToRoutine, 
    getRoutineExercises, 
    updateExerciseProgress, 
    updateRoutineExerciseTarget, 
    removeExerciseFromRoutine 
} from "../controllers/routineExercise.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas requieren estar autenticado
router.use(authenticateToken);

// Obtener todos los ejercicios de una rutina (o filtrar por día usando query ?day=Lunes)
router.get("/routine/:routineId", getRoutineExercises);

// Agregar un ejercicio a una rutina existente (Solo Coaches)
router.post("/routine/:routineId", authorizeRoles("coach"), addExerciseToRoutine);

// Modificar las metas asignadas por el profesor (Solo Coaches)
router.patch("/:id/target", authorizeRoles("coach"), updateRoutineExerciseTarget);

// Registrar el progreso real del alumno (Lo usa el alumno al entrenar, o el coach)
router.patch("/:id/progress", updateExerciseProgress);

// Eliminar un ejercicio específico de la rutina (Solo Coaches)
router.delete("/:id", authorizeRoles("coach"), removeExerciseFromRoutine);

export default router;