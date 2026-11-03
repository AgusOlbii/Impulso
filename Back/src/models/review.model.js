import pool from "../config/db.js";

export class ReviewModel {
  // Crear una reseña y recargar las métricas del profesor
  static async create({ coach_id, student_id, rating, comment }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar la reseña
      const [result] = await connection.query(
        `INSERT INTO reviews (coach_id, student_id, rating, comment)
         VALUES (?, ?, ?, ?)`,
        [coach_id, student_id, rating, comment]
      );

      // 2. Recalcular promedio y total de reseñas para el profesor
      await connection.query(
        `UPDATE coaches 
         SET rating = (SELECT AVG(rating) FROM reviews WHERE coach_id = ?),
             reviews = (SELECT COUNT(*) FROM reviews WHERE coach_id = ?)
         WHERE id = ?`,
        [coach_id, coach_id, coach_id]
      );

      await connection.commit();
      return { id: result.insertId, coach_id, student_id, rating, comment };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtener todas las reseñas de un profesor específico
  static async findByCoachId(coach_id) {
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS student_name, u.lastname AS student_lastname, u.image_url AS student_avatar
       FROM reviews r
       JOIN students s ON r.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE r.coach_id = ?
       ORDER BY r.created_at DESC`,
      [coach_id]
    );
    return rows;
  }

  // Verificar si un alumno ya calificó a un profesor
  static async findByStudentAndCoach(student_id, coach_id) {
    const [rows] = await pool.query(
      `SELECT * FROM reviews WHERE student_id = ? AND coach_id = ?`,
      [student_id, coach_id]
    );
    return rows[0];
  }

  // Eliminar una reseña y actualizar métricas del profesor
  static async delete(id, coach_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `DELETE FROM reviews WHERE id = ?`,
        [id]
      );

      // Recalcular métricas
      await connection.query(
        `UPDATE coaches 
         SET rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE coach_id = ?), 0),
             reviews = (SELECT COUNT(*) FROM reviews WHERE coach_id = ?)
         WHERE id = ?`,
        [coach_id, coach_id, coach_id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}