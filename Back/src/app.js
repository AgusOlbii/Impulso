import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import coachRoutes from "./routes/coach.routes.js";
import routineRoutes from "./routes/routine.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import coachApplicationRoutes from './routes/coachApplication.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET en .env");
}

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "../uploads")));

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      ok: true,
      message: "Backend y MySQL conectados correctamente",
    });
  } catch (error) {
    console.error("Error de MySQL:", error.message);

    res.status(500).json({
      ok: false,
      message: "Error de conexión con MySQL",
    });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});


// ruta users
app.use("/api/users", userRoutes);
//Ruta login y register
app.use("/api/auth", authRoutes);


app.use("/api/students", studentRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/reviews", reviewRoutes);
// Ruta aplicaciones a coach
app.use('/api/coach-applications', coachApplicationRoutes);
//rutas admin
app.use('/api/admin', adminRoutes);