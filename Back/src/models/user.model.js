import pool from "../config/db.js";

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

  // Buscar usuario por Email 
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

  // Actualizar datos de usuario
 static async update(userId, fields) {
  // 1. Consultamos el rol del usuario para saber qué tabla específica actualizar
  const [userRows] = await pool.query(
    "SELECT rol FROM users WHERE id = ?",
    [userId]
  );

  if (userRows.length === 0) return false;
  const rol = userRows[0].rol;

  // Campos que pertenecen estrictamente a la tabla 'users'
  const userFieldsKeys = ["name", "lastname", "email", "phone", "dni", "birthday", "image_url"];
  
  const userUpdates = {};
  const specificUpdates = {};

  for (const [key, value] of Object.entries(fields)) {
    // Limpiamos cadenas vacías o indefinidas para convertirlas en null (evita errores en MySQL)
    const cleanValue = (value === "" || value === undefined) ? null : value;

    if (userFieldsKeys.includes(key)) {
      userUpdates[key] = cleanValue;
    } else {
      specificUpdates[key] = cleanValue;
    }
  }

  // Ejecutamos la actualizacion en la tabla 'users' si hay cambios
  if (Object.keys(userUpdates).length > 0) {
    const keys = Object.keys(userUpdates);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(userUpdates);

    await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, userId]
    );
  }
  return true;
}

  // Cambiar estado activo/inactivo (Desactivar cuenta)
  static async toggleStatus(id, isActive) {
    const [result] = await pool.query(
      `UPDATE users SET is_active = ? WHERE id = ?`,
      [isActive, id]
    );
    return result.affectedRows > 0;
  }

  // Busca los datos de la tabla user y de la tabla del rol correspondiente
  static async findByIdWithRoleData(userId) {
    // 1. Buscamos primero los datos base del usuario en la tabla 'users'
    const [userRows] = await pool.query(
      "SELECT id, name, lastname, email, rol, phone, dni, birthday, image_url, is_active, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) return null;
    const user = userRows[0];

    // 2. Evaluamos el rol para traer los datos específicos de su tabla correspondiente
    if (user.rol === "student") {
      const [studentRows] = await pool.query(
        "SELECT id AS student_id, weight, height, goal, medical_notes FROM students WHERE user_id = ?",
        [userId]
      );
      
      if (studentRows.length > 0) {
        // Combinamos los datos del usuario con los del estudiante
        return { ...user, ...studentRows[0] };
      }
    } 
    else if (user.rol === "coach") {
      const [coachRows] = await pool.query(
        "SELECT id AS coach_id, specialization, experience_years FROM coaches WHERE user_id = ?",
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