// src/models/user.model.js
import pool from "../config/db.js"; // Asume que tenés tu conexión configurada aquí

export class UserModel {
  // Buscar un usuario por su email (útil para verificar si ya existe o para el login)
  static async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0]; // Retorna el usuario o undefined si no existe
  }

  // Crear un nuevo usuario en la base de datos con todos los campos que validaba tu registro
  static async create({ name, email, hashedPassword, rol, phone, dni }) {
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, rol, phone, dni) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, rol || 'alumno', phone, dni]
    );

    // Retornamos el ID generado y los datos básicos
    return {
      id: result.insertId,
      name,
      email,
      rol: rol || 'alumno'
    };
  }
}