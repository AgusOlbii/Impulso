import { Router } from "express";
import { getStudentById, updateStudent, hireCoach, updateCoachNote } from "../controllers/student.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";


const router = Router();

router.put("/me/coach", authenticateToken, authorizeRoles("student"), hireCoach);
router.put("/:id/note", authenticateToken, authorizeRoles("coach"), updateCoachNote);
router.get("/:id", authenticateToken, getStudentById);

//Ruta para actualizar datos del estudiante 
router.put("/:id/update", authenticateToken, authorizeRoles("student"), updateStudent);

export default router;