import { Router } from "express";
import { getStudentById, updateStudent, hireCoach } from "../controllers/student.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";


const router = Router();

router.put("/me/coach", authenticateToken, authorizeRoles("student"), hireCoach);
router.get("/:id", authenticateToken, getStudentById);

//Ruta para actualizar datos del estudiante 
router.put("/:id/update", authenticateToken, authorizeRoles("student"), updateStudent);

export default router;