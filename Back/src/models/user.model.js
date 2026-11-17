import pool from "../config/db.js";
import { StudentModel } from "./student.model.js";

export class UserModel {
  // Crear un nuevo usuario
  static async create({ name, lastname, email, password, rol, phone, dni, birthday, is_active, image_url }) {
    const [result] = await pool.query(
      `INSERT INTO users (name, lastname, email, password, rol, phone, dni, birthday, is_active, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, email, password, rol || "alumno", phone || null, dni, birthday || null, is_active ?? true, image_url || null]
    );
    return { id: result.insertId, name, lastname, email, rol };
  }

  // Buscar usuario por Email (verificacion de sesion con email)
  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? AND is_active = TRUE`,
      [email]
    );
    return rows[0];
  }
  // Buscar usuario por ID
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, name, lastname, email, rol, phone, dni, birthday, image_url, is_active, created_at 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
   // Buscar usuario por DNI
  static async findByDni(dni) {
    const [rows] = await pool.query(
      `SELECT id, name, lastname, email, rol, phone, dni, birthday, image_url, is_active, created_at 
       FROM users WHERE dni = ?`,
      [dni]
    );
    return rows[0];
  }

  // Obtener todos los usuarios (para Admin)
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT id, name, lastname, email, rol, phone, dni, birthday, image_url, is_active, created_at 
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  }

  static async update(userId, fields) {
    const [userRows] = await pool.query(
      "SELECT rol FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) return false;
    const rol = userRows[0].rol;

    const userFieldsKeys = ["name", "lastname", "email", "phone", "dni", "birthday", "image_url"];
    const studentFieldsKeys = ["weight", "height", "goal", "medical_notes"];
    const userUpdates = {};
    const studentUpdates = {};

    for (const [key, value] of Object.entries(fields)) {
      let cleanValue = value === "" || value === undefined ? null : value;
      if (key === "birthday" && cleanValue) {
        cleanValue = String(cleanValue).split("T")[0];
      }
      if (userFieldsKeys.includes(key)) {
        userUpdates[key] = cleanValue;
      } else if (studentFieldsKeys.includes(key)) {
        studentUpdates[key] = cleanValue;
      }
    }

    if (Object.keys(userUpdates).length > 0) {
      const keys = Object.keys(userUpdates);
      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      await pool.query(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...Object.values(userUpdates), userId]
      );
    }

    if (rol === "student" && Object.keys(studentUpdates).length > 0) {
      await StudentModel.ensureCoachColumn();
      const keys = Object.keys(studentUpdates);
      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      await pool.query(
        `UPDATE students SET ${setClause} WHERE user_id = ?`,
        [...Object.values(studentUpdates), userId]
      );
    }

    return true;
  }
// Actualizar rol del usuario
static async updateRole(userId, newRole) {
  const [result] = await pool.query(
    "UPDATE users SET rol = ? WHERE id = ?",
    [newRole, userId]
  );
  return result;
}
  // Cambiar estado activo/inactivo (Desactivar cuenta)
  static async toggleStatus(id, isActive) {
    const [result] = await pool.query(
      `UPDATE users SET is_active = ? WHERE id = ?`,
      [isActive, id]
    );
    return result.affectedRows > 0;
  }

  // Baja: elimina la cuenta y los datos que dependen de ese usuario
  static async delete(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [userRows] = await connection.query(
        "SELECT id FROM users WHERE id = ?",
        [userId]
      );
      if (!userRows.length) {
        await connection.rollback();
        return false;
      }

      const [studentRows] = await connection.query(
        "SELECT id FROM students WHERE user_id = ?",
        [userId]
      );
      const studentId = studentRows[0]?.id;

      const [coachRows] = await connection.query(
        "SELECT id FROM coaches WHERE user_id = ?",
        [userId]
      );
      const coachId = coachRows[0]?.id;

      if (studentId) {
        await connection.query("DELETE FROM payments WHERE student_id = ?", [studentId]);
        await connection.query("DELETE FROM reviews WHERE student_id = ?", [studentId]);
        await connection.query(
          `DELETE re FROM routine_exercises re
           INNER JOIN routines r ON r.id = re.routine_id
           WHERE r.student_id = ?`,
          [studentId]
        );
        await connection.query("DELETE FROM routines WHERE student_id = ?", [studentId]);
        await connection.query("DELETE FROM students WHERE id = ?", [studentId]);
      }

      if (coachId) {
        const [coachIdCol] = await connection.query("SHOW COLUMNS FROM students LIKE 'coach_id'");
        if (coachIdCol.length) {
          await connection.query("UPDATE students SET coach_id = NULL WHERE coach_id = ?", [coachId]);
        }
        await connection.query("DELETE FROM payments WHERE coach_id = ?", [coachId]);
        await connection.query("DELETE FROM reviews WHERE coach_id = ?", [coachId]);
        await connection.query(
          `DELETE re FROM routine_exercises re
           INNER JOIN routines r ON r.id = re.routine_id
           WHERE r.coach_id = ?`,
          [coachId]
        );
        await connection.query("DELETE FROM routines WHERE coach_id = ?", [coachId]);
        await connection.query("DELETE FROM coaches WHERE id = ?", [coachId]);
      }

      await connection.query("DELETE FROM notifications WHERE user_id = ?", [userId]);
      await connection.query("DELETE FROM coach_applications WHERE user_id = ?", [userId]);

      const [result] = await connection.query("DELETE FROM users WHERE id = ?", [userId]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Busca los datos de la tabla user y de la tabla del rol correspondiente
  static async findByIdWithRoleData(userId) {
    //Buscamos primero los datos base del usuario en la tabla 'users'
    const [userRows] = await pool.query(
      "SELECT id, name, lastname, email, rol, phone, dni, birthday, image_url, is_active, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) return null;
    const user = userRows[0];

    //Evaluamos el rol para traer los datos específicos de su tabla correspondiente
    if (user.rol === "student") {
      await StudentModel.ensureCoachColumn();
      await StudentModel.ensureCoachNoteColumn();
      const [studentRows] = await pool.query(
        "SELECT id AS student_id, weight, height, goal, medical_notes, coach_id, coach_note FROM students WHERE user_id = ?",
        [userId]
      );
      
      if (studentRows.length > 0) {
        // Combinamos los datos del usuario con los del estudiante
        return { ...user, ...studentRows[0] };
      }
    } 
    else if (user.rol === "coach") {
      const [coachRows] = await pool.query(
        "SELECT id AS coach_id, specialty, experience FROM coaches WHERE user_id = ?",
        [userId]
      );
      
      if (coachRows.length > 0) {
        // Combinamos los datos del usuario con los del coach
        return { ...user, ...coachRows[0] };
      }
    }

    // Si no tiene rol específico o no se encontró en la otra tabla, devolvemos solo el usuario
    return user;
  }
}