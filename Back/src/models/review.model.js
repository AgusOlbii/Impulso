import pool from "../config/db.js";

export class ReviewModel {
  static async ensureCoachRatingColumns() {
    const [ratingCol] = await pool.query("SHOW COLUMNS FROM coaches LIKE 'rating'");
    if (!ratingCol.length) {
      await pool.query("ALTER TABLE coaches ADD COLUMN rating DECIMAL(3,2) NOT NULL DEFAULT 0");
    }
    const [reviewsCol] = await pool.query("SHOW COLUMNS FROM coaches LIKE 'reviews'");
    if (!reviewsCol.length) {
      await pool.query("ALTER TABLE coaches ADD COLUMN reviews INT NOT NULL DEFAULT 0");
    }
  }

  static async refreshCoachRating(connection, coach_id) {
    await connection.query(
      `UPDATE coaches
       SET rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE coach_id = ?), 0),
           reviews = (SELECT COUNT(*) FROM reviews WHERE coach_id = ?)
       WHERE id = ?`,
      [coach_id, coach_id, coach_id]
    );
  }

  // Crear una reseña y recargar las métricas del profesor
  static async create({ coach_id, student_id, rating, comment }) {
    await this.ensureCoachRatingColumns();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar la reseña
      const [result] = await connection.query(
        `INSERT INTO reviews (coach_id, student_id, rating, comment)
         VALUES (?, ?, ?, ?)`,
        [coach_id, student_id, rating, comment || ""]
      );

      await this.refreshCoachRating(connection, coach_id);

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

  static async update(id, { rating, comment, coach_id }) {
    await this.ensureCoachRatingColumns();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE reviews SET rating = ?, comment = ? WHERE id = ?`,
        [rating, comment || "", id]
      );
      await this.refreshCoachRating(connection, coach_id);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
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

      await this.refreshCoachRating(connection, coach_id);

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