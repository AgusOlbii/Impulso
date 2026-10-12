
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

async function createAdmin() {
  try {
    const name = "Administrador";
    const email = "agustinolbinsky@hotmail.com";
    const password = process.env.ADMIN_PASSWORD;

    if (!password || password.length < 12) {
      throw new Error(
        "Configurá ADMIN_PASSWORD con al menos 12 caracteres en .env"
      );
    }

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("El administrador ya existe.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.execute(
      `INSERT INTO users (name, email, password_hash, rol)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, "admin"]
    );

    console.log("Administrador creado correctamente.");
    console.log("Email:", email);
  } catch (error) {
    console.error("Error creando administrador:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdmin();