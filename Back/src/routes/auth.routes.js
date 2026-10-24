// routes/auth.routes.js
import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { registerUserSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/login", login);
router.post("/register", validateSchema(registerUserSchema), register);
router.post("/logout", logout);


router.get("/me", authenticateToken, me);


export default router;