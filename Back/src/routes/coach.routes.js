// src/routes/coach.routes.js
import { Router } from "express";
import { getCoaches, createCoach } from "../controllers/coach.controller.js";
import { auth } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createCoachSchema } from "../schemas/coach.schema.js";

const router = Router();

// Obtener todos los profesores (público o protegido)
router.get("/coaches", getCoaches);

// Crear un profesor validando los datos con el esquema
router.post("/coaches", auth, validateSchema(createCoachSchema), createCoach);

export default router;