import { Router } from "express";
import { getMyReview, upsertMyReview } from "../controllers/review.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/me", authenticateToken, authorizeRoles("student"), getMyReview);
router.put("/me", authenticateToken, authorizeRoles("student"), upsertMyReview);

export default router;
