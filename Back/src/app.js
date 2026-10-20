import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

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


// ruta users
app.use("/api/users", userRoutes);
//Ruta login y register
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});