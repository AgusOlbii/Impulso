import { Router } from "express";
import { getMyProfile, updateUser } from "../controllers/user.controller.js";
import { authenticateToken} from "../middlewares/auth.js";
const router = Router();

// GET /api/users/:id
router.get("/:id", getMyProfile);

// Actualizar datos solo de la tabla USERS
router.put("/:id/update", authenticateToken, updateUser);
export default router;