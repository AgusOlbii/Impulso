// routes/auth.routes.js
import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { registerUserSchema } from "../schemas/user.schema.js";

const router = Router();

// Registro (Ahora utiliza el esquema de validación y el middleware genérico)
router.post("/register", validateSchema(registerUserSchema), register);

// Login, Me, Logout
router.post("/login", login);
router.get("/me", authenticateToken, me);
router.post("/logout", logout);

export default router;