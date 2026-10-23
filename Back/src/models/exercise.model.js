import pool from "../config/db.js";

export class ExerciseModel {
  // Crear un nuevo ejercicio (Admin)
  static async create({ name, description, muscle_group, video_url }) {
    const [result] = await pool.query(
      `INSERT INTO exercises (name, description, muscle_group, video_url)
       VALUES (?, ?, ?, ?)`,
      [name, description || null, muscle_group, video_url || null]
    );
    return { id: result.insertId, name, muscle_group };
  }

  // Obtener todos los ejercicios del catálogo global
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT * FROM exercises ORDER BY muscle_group ASC, name ASC`
    );
    return rows;
  }

  // Buscar un ejercicio por su ID
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM exercises WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

    // Buscar un ejercicio por su Nombre
  static async findByName(name) {
    const [rows] = await pool.query(
      `SELECT * FROM exercises WHERE id = ?`,
      [name]
    );
    return rows[0];
  }

  // Filtrar ejercicios por grupo muscular
  static async findByMuscleGroup(muscle_group) {
    const [rows] = await pool.query(
      `SELECT * FROM exercises WHERE muscle_group = ? ORDER BY name ASC`,
      [muscle_group]
    );
    return rows;
  }

  // Actualizar un ejercicio
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(fields);

    const [result] = await pool.query(
      `UPDATE exercises SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  // Eliminar un ejercicio del catálogo global
  static async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM exercises WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}