import pool from "../config/db.js";

export class CoachModel {
  // Crear un nuevo perfil de profesor (se ejecuta al aprobar la solicitud)
  static async create({ user_id, name, specialty, experience, price, description, image, position }) {
    const [result] = await pool.query(
      `INSERT INTO coaches (user_id, name, specialty, experience, price, description, image, position, rating, reviews, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, TRUE)`,
      [user_id, name, specialty, experience, price, description, image || null, position || null]
    );
    return { id: result.insertId, user_id, name, specialty, price };
  }

  // Obtener la lista pública de profesores disponibles (Vitrina Frontend)
  static async findAllAvailable() {
    const [rows] = await pool.query(
      `SELECT c.*, u.email, u.phone 
       FROM coaches c
       JOIN users u ON c.user_id = u.id
       WHERE c.available = TRUE AND u.is_active = TRUE
       ORDER BY c.rating DESC, c.reviews DESC`
    );
    return rows;
  }

  // Buscar un profesor por su ID de profesor
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT c.*, u.email, u.phone, u.image_url AS avatar
       FROM coaches c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }
    // Buscar un profesor por su Nombre
  static async findByName(name) {
    const [rows] = await pool.query(
      `SELECT c.*, u.name, u.lastname, u.email, u.phone, u.image_url AS avatar
       FROM coaches c
       JOIN users u ON c.user_id = u.id
       WHERE c.name = ?`,
      [name]
    );
    return rows[0];
  }

  // Buscar perfil de profesor por su user_id
  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      `SELECT * FROM coaches WHERE user_id = ?`,
      [user_id]
    );
    return rows[0];
  }

  // Actualizar perfil de profesor
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(fields);

    const [result] = await pool.query(
      `UPDATE coaches SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  // Cambiar disponibilidad (Activo/Inactivo en vitrina)
  static async toggleAvailability(id, available) {
    const [result] = await pool.query(
      `UPDATE coaches SET available = ? WHERE id = ?`,
      [available, id]
    );
    return result.affectedRows > 0;
  }
}