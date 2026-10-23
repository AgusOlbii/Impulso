import pool from "../config/db.js";

export class StudentModel {
  // Crear el perfil del alumno
  static async create({ user_id }) {
    const [result] = await pool.query(
      `INSERT INTO students (user_id)
       VALUES (?)`,
      [user_id]
    );
    return { id: result.insertId, user_id};
  }

  // Buscar perfil de alumno por student_id (incluyendo datos base de users)
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, u.name, u.lastname, u.email, u.phone, u.dni, u.image_url, u.is_active
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Buscar perfil de alumno por user_id
  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      `SELECT s.*, u.name, u.lastname, u.email, u.image_url
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = ?`,
      [user_id]
    );
    return rows[0];
  }

  // Obtener todos los alumnos (para Admin o Vista General)
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT s.*, u.name, u.lastname, u.email, u.phone, u.image_url, u.is_active
       FROM students s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    return rows;
  }

  // Actualizar datos del perfil de alumno
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(fields);

    const [result] = await pool.query(
      `UPDATE students SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }
}