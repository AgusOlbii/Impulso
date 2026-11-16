import { Router } from "express";
import { 
    createExercise, 
    getExercises,
    updateExercise,
    deleteExercise 
} from "../controllers/exercise.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createExerciseSchema } from "../schemas/exercise.schema.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// Obtener todos los ejercicios (admite filtros por query: /exercises?muscle_group=Piernas)
router.get("/", authenticateToken, getExercises);

// Crear un ejercicio
router.post("/", authenticateToken, authorizeRoles("admin", "coach"), validateSchema(createExerciseSchema), createExercise);
// Actualizar un ejercicio
router.put("/:id", authenticateToken, authorizeRoles("admin", "coach"), updateExercise);
// Eliminar un ejercicio por ID
router.delete("/:id", authenticateToken, authorizeRoles("admin", "coach"), deleteExercise);

export default router;