import { Router } from "express";
import { getMyProfile, updateMyProfile, updateUser, uploadMyPhoto } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { uploadPhoto } from "../middlewares/upload.js";

const router = Router();

router.post("/me/photo", authenticateToken, (req, res, next) => {
  uploadPhoto.single("photo")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ ok: false, message: err.message });
    }
    next();
  });
}, uploadMyPhoto);

router.put("/me", authenticateToken, updateMyProfile);
router.get("/:id", getMyProfile);
router.put("/:id/update", authenticateToken, updateUser);
export default router;