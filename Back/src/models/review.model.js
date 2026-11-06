import pool from "../config/db.js";

export class ReviewModel {
  static async upsert({ coach_id, student_id, rating, comment }) {
    const existing = await this.findByStudentAndCoach(student_id, coach_id);
    const text = comment?.trim() ? comment.trim() : "";
    if (existing) {
      await pool.query(
        `UPDATE reviews SET rating = ?, comment = ? WHERE id = ?`,
        [rating, text, existing.id]
      );
      return { ...existing, rating, comment: text };
    }

    const [result] = await pool.query(
      `INSERT INTO reviews (coach_id, student_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [coach_id, student_id, rating, text]
    );
    return { id: result.insertId, coach_id, student_id, rating, comment: text };
  }

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

  static async findByStudentAndCoach(student_id, coach_id) {
    const [rows] = await pool.query(
      `SELECT * FROM reviews WHERE student_id = ? AND coach_id = ?`,
      [student_id, coach_id]
    );
    return rows[0];
  }

  static async statsByCoachId(coach_id) {
    const [rows] = await pool.query(
      `SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS review_count
       FROM reviews WHERE coach_id = ?`,
      [coach_id]
    );
    return rows[0];
  }
}
