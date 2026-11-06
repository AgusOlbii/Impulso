import pool from "../config/db.js";

export class CoachModel {
  static async ensureStudentNoteColumn() {
    const [cols] = await pool.query("SHOW COLUMNS FROM coaches LIKE 'student_note'");
    if (cols.length) return;
    await pool.query("ALTER TABLE coaches ADD COLUMN student_note TEXT NULL");
  }

  // Crear un nuevo perfil de profesor (se ejecuta al aprobar la solicitud)
  static async create({ user_id, specialty, experience, price, description, image, position }) {
    const [result] = await pool.query(
      `INSERT INTO coaches (user_id, specialty, experience, price, description, image, position, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [user_id, specialty, experience, price, description, image || null, position || null]
    );
    return { id: result.insertId, user_id, specialty, price };
  }

  // Obtener la lista pública de profesores disponibles
  static async findAllAvailable() {
    const [rows] = await pool.query(
      `SELECT c.*, u.name, u.lastname, u.email, u.phone, u.image_url,
              ca.description AS application_description,
              COALESCE(sc.student_count, 0) AS student_count
       FROM coaches c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN coach_applications ca
         ON ca.user_id = c.user_id AND ca.status = 'approved'
       LEFT JOIN (
         SELECT coach_id, COUNT(*) AS student_count
         FROM students
         WHERE coach_id IS NOT NULL
         GROUP BY coach_id
       ) sc ON sc.coach_id = c.id
       WHERE c.available = TRUE AND u.is_active = TRUE
       ORDER BY c.id DESC`
    );
    return rows;
  }
 // Obtener la lista de todos los students de un profesor
 static async getStudentsByCoach(coach_id) {
  const [rows] = await pool.query(
    `SELECT s.id, s.user_id, s.weight, s.height, s.goal, s.medical_notes, s.coach_note,
            u.name, u.lastname, u.email,
            COALESCE(rt.routine_count, 0) AS routine_count
     FROM students s
     JOIN users u ON s.user_id = u.id
     LEFT JOIN (
       SELECT student_id, COUNT(*) AS routine_count
       FROM routines
       WHERE coach_id = ?
       GROUP BY student_id
     ) rt ON rt.student_id = s.id
     WHERE s.coach_id = ?
     ORDER BY u.name ASC`,
    [coach_id, coach_id]
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
       WHERE u.name = ?`,
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