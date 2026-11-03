import pool from "../config/db.js";

export class RoutineModel {
  // Crear una nueva rutina asignada a un alumno por un profesor
  static async create({ coach_id, student_id, title, description, start_date, end_date }) {
    const [result] = await pool.query(
      `INSERT INTO routines (coach_id, student_id, title, description, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [coach_id, student_id, title, description || null, start_date, end_date]
    );
    return { id: result.insertId, coach_id, student_id, title, start_date, end_date };
  }

  // Buscar rutina por ID con detalles del profesor y alumno
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT r.*, 
              c.name AS coach_name, c.specialty AS coach_specialty,
              s.id AS student_id_profile, u.name AS student_name, u.lastname AS student_lastname
       FROM routines r
       JOIN coaches c ON r.coach_id = c.id
       JOIN students s ON r.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Obtener todas las rutinas asignadas a un alumno específico
  static async findByStudentId(student_id) {
    const [rows] = await pool.query(
      `SELECT r.*, c.name AS coach_name, c.image AS coach_image
       FROM routines r
       JOIN coaches c ON r.coach_id = c.id
       WHERE r.student_id = ?
       ORDER BY r.start_date DESC`,
      [student_id]
    );
    return rows;
  }

  // Obtener todas las rutinas creadas por un profesor específico
  static async findByCoachId(coach_id) {
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS student_name, u.lastname AS student_lastname
       FROM routines r
       JOIN students s ON r.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE r.coach_id = ?
       ORDER BY r.created_at DESC`,
      [coach_id]
    );
    return rows;
  }

  // Actualizar datos generales de la rutina
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(fields);

    const [result] = await pool.query(
      `UPDATE routines SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  // Eliminar una rutina
  static async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM routines WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}