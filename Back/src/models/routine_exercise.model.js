import pool from "../config/db.js";

export class RoutineExerciseModel {
  // Agregar un ejercicio a una rutina en un día específico (Profesor)
  static async create({ routine_id, day_of_week, exercise_id, target_sets, target_reps, target_weight }) {
    const [result] = await pool.query(
      `INSERT INTO routine_exercises 
        (routine_id, day_of_week, exercise_id, target_sets, target_reps, target_weight, completed)
       VALUES (?, ?, ?, ?, ?, ?, FALSE)`,
      [routine_id, day_of_week, exercise_id, target_sets, target_reps, target_weight || 0]
    );
    return { id: result.insertId, routine_id, day_of_week, exercise_id };
  }

  // Obtener todos los ejercicios de una rutina agrupados por día con info del catálogo de ejercicios
  static async findByRoutineId(routine_id) {
    const [rows] = await pool.query(
      `SELECT re.*, e.name AS exercise_name, e.description AS exercise_description, e.muscle_group, e.video_url
       FROM routine_exercises re
       JOIN exercises e ON re.exercise_id = e.id
       WHERE re.routine_id = ?
       ORDER BY FIELD(re.day_of_week, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')`,
      [routine_id]
    );
    return rows;
  }

  // Obtener los ejercicios de un día en particular dentro de una rutina
  static async findByRoutineAndDay(routine_id, day_of_week) {
    const [rows] = await pool.query(
      `SELECT re.*, e.name AS exercise_name, e.description, e.muscle_group, e.video_url
       FROM routine_exercises re
       JOIN exercises e ON re.exercise_id = e.id
       WHERE re.routine_id = ? AND re.day_of_week = ?`,
      [routine_id, day_of_week]
    );
    return rows;
  }

  // Registrar progreso del alumno (Marcar completado y actualizar marcas reales)
  static async logProgress(id, { actual_sets, actual_reps, actual_weight, completed }) {
    const [result] = await pool.query(
      `UPDATE routine_exercises 
       SET actual_sets = ?, actual_reps = ?, actual_weight = ?, completed = ?
       WHERE id = ?`,
      [actual_sets, actual_reps, actual_weight, completed ?? true, id]
    );
    return result.affectedRows > 0;
  }

  // Actualizar meta asignada por el profesor
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(fields);

    const [result] = await pool.query(
      `UPDATE routine_exercises SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  }

  // Eliminar un ejercicio de la rutina
  static async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM routine_exercises WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}