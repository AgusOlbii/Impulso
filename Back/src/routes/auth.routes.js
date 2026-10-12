// routes/auth.routes.js
import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { authenticateToken, validateRegisterInput } from "../middlewares/auth.js";

const router = Router();

// Registro
router.post("/register", validateRegisterInput, register);

// Login, Me, Logout
router.post("/login", login);
router.get("/me", authenticateToken, me);
router.post("/logout", logout);

export default router;