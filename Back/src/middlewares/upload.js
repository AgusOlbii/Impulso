import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  },
});

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      cb(new Error("Solo se pueden subir imágenes"));
      return;
    }
    cb(null, true);
  },
});
