import { Router } from "express";
import { getUserById } from "../controllers/user.controller.js";

const router = Router();

// GET /api/users/:id
router.get("/:id", getUserById);

export default router;