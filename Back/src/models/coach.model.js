import pool from "../config/db.js";

export class CoachModel {
  // Crear un nuevo perfil de profesor (se ejecuta al aprobar la solicitud)
  static async create({ user_id, name, specialty, experience, price, description, image, position }) {
    const [result] = await pool.query(
      `INSERT INTO coaches (user_id, specialty, experience, price, description, image, position, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [user_id, name, specialty, experience, price, description, image || null, position || null]
    );
    return { id: result.insertId, user_id, name, specialty, price };
  }

  // Obtener la lista pública de profesores disponibles
  static async findAllAvailable() {
    const [rows] = await pool.query(
      `SELECT c.*, u.email, u.phone 
       FROM coaches c
       JOIN users u ON c.user_id = u.id
       WHERE c.available = TRUE AND u.is_active = TRUE`
    );
    return rows;
  }
 // Obtener la lista de todos los students de un profesor
 static async getStudentsByCoach(coach_id) {
  const [rows] = await pool.query(
    `SELECT DISTINCT 
          u.id AS student_id, 
          u.name, 
          u.email, 
          p.status AS latest_payment_status,
          p.created_at AS last_interaction
       FROM payments p
       JOIN users u ON p.student_id = u.id
       WHERE p.coach_id = ? AND p.status = 'completed'
       ORDER BY p.created_at DESC`,
    [coach_id]
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
 static async update(coachId, fields) {
  // Buscamos el user_id asociado al coach usando el ID del coach
  const [coachRows] = await pool.query(
    "SELECT user_id FROM coaches WHERE id = ?",
    [coachId]
  );

  if (coachRows.length === 0) return false;
  const userId = coachRows[0].user_id;

  // Definimos cuáles campos van a la tabla 'users'
  const userFieldsKeys = ["name", "lastname", "email", "phone", "dni", "birthday", "image_url"];
  
  const userUpdates = {};
  const coachUpdates = {};

  // Separamos y limpiamos los campos recibidos
  for (const [key, value] of Object.entries(fields)) {
    const cleanValue = (value === "" || value === undefined) ? null : value;

    if (userFieldsKeys.includes(key)) {
      userUpdates[key] = cleanValue;
    } else {
      coachUpdates[key] = cleanValue;
    }
  }

  // Actualizamos la tabla users si hay campos para modificar
  if (Object.keys(userUpdates).length > 0) {
    const keys = Object.keys(userUpdates);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(userUpdates);

    await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, userId]
    );
  }

  // Actualizamos la tabla coaches con sus campos específicos de tu base de datos
  if (Object.keys(coachUpdates).length > 0) {
    const keys = Object.keys(coachUpdates);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(coachUpdates);

    await pool.query(
      `UPDATE coaches SET ${setClause} WHERE id = ?`,
      [...values, coachId]
    );
  }

  return true;
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