import pool from "../config/db.js";

export class UserModel {
  // Crear un nuevo usuario
  static async create({ name, lastname, email, password, rol, phone, dni, is_active, image_url }) {
    const [result] = await pool.query(
      `INSERT INTO users (name, lastname, email, password, rol, phone, dni, is_active, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, email, password, rol || "alumno", phone || null, dni, is_active ?? true, image_url || null]
    );
    return { id: result.insertId, name, lastname, email, rol };
  }

  // Buscar usuario por Email 
  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? AND is_active = TRUE`,
      [email]
    );
    return rows[0];
  }
  // Buscar usuario por ID
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, name, lastname, email, rol, phone, dni, image_url, is_active, created_at 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
   // Buscar usuario por ID
  static async findByDni(dni) {
    const [rows] = await pool.query(
      `SELECT id, name, lastname, email, rol, phone, dni, image_url, is_active, created_at 
       FROM users WHERE dni = ?`,
      [dni]
    );
    return rows[0];
  }

  // Obtener todos los usuarios (para Admin)
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT id, name, lastname, email, rol, phone, dni, image_url, is_active, created_at 
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  }

  // Actualizar datos de usuario
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(fields);

    const [result] = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  // Cambiar estado activo/inactivo (Desactivar cuenta)
  static async toggleStatus(id, isActive) {
    const [result] = await pool.query(
      `UPDATE users SET is_active = ? WHERE id = ?`,
      [isActive, id]
    );
    return result.affectedRows > 0;
  }
}