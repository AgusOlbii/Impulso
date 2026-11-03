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
      `SELECT s.*, u.name, u.lastname, u.email, u.phone, u.dni, u.birthday u.image_url, u.is_active
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
      `SELECT s.*, u.name, u.lastname, u.email, u.dni, u.phone, u.bithday, u.image_url
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
      `SELECT s.*, u.name, u.lastname, u.email, u.phone, u.birthday, u.image_url, u.is_active
       FROM students s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    return rows;
  }

//Actualizar datos de la tabla students y sus respectivos campos en tabl user
static async update(studentId, fields) {
  const [studentRows] = await pool.query(
    "SELECT user_id FROM students WHERE id = ?",
    [studentId]
  );

  if (studentRows.length === 0) return false;
  const userId = studentRows[0].user_id;

  const userFieldsKeys = ["name", "lastname", "email", "phone", "dni", "birthday", "image_url"];
  
  const userUpdates = {};
  const studentUpdates = {};

  for (const [key, value] of Object.entries(fields)) {

    const cleanValue = (value === "" || value === undefined) ? null : value;

    if (userFieldsKeys.includes(key)) {
      userUpdates[key] = cleanValue;
    } else {
      studentUpdates[key] = cleanValue;
    }
  }

  // Se ejecuta la actualizacion en la tabla users si hay campos propios
  if (Object.keys(userUpdates).length > 0) {
    const keys = Object.keys(userUpdates);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(userUpdates);

    await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, userId]
    );
  }

  // Se ejecuta la actualizacion en la tabla students si hay campos propios
  if (Object.keys(studentUpdates).length > 0) {
    const keys = Object.keys(studentUpdates);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(studentUpdates);

    await pool.query(
      `UPDATE students SET ${setClause} WHERE id = ?`,
      [...values, studentId]
    );
  }

  return true;
}}