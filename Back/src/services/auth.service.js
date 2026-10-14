import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const loginUser = async (email, password) => {
  // 1. Consulta SQL
  const [users] = await pool.execute(
    `SELECT id, name, email, password_hash, rol, activo
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  const user = users[0];

  // 2. Comprobar existencia y contraseña
  if (!user || !user.activo || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 3. Generar token
  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      rol: user.rol,
    },
  };
};

export const getUserById = async (userId) => {
  const [users] = await pool.execute(
    `SELECT id, name, email, rol, activo
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId]
  );

  return users[0];
};


export const registerUser = async ({ name, email, password, rol }) => {
  // 1. Normalizar los datos
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // 2. Validar el rol
  // El registro público solo permite alumnos.
  // Los profesores deben ser autorizados por el backend.
  const userRole = rol || "alumno";

  if (!["alumno", "profesor"].includes(userRole)) {
    throw new Error("INVALID_ROLE");
  }

  // 3. Verificar si el email ya existe
  const [existingUsers] = await pool.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [cleanEmail]
  );

  if (existingUsers.length > 0) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // 4. Encriptar la contraseña
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 5. Iniciar la transacción
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insertar el usuario
    const [userResult] = await connection.execute(
      `INSERT INTO users (name, email, password_hash, rol, phone, dni)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cleanName, cleanEmail, passwordHash, userRole, 0, 0]
    );

    const newUserId = userResult.insertId;

    // Crear el perfil correspondiente
    if (userRole === "profesor") {
      await connection.execute(
        `INSERT INTO professors (user_id, status)
         VALUES (?, 'pending')`,
        [newUserId]
      );
    } else if (userRole === "alumno") {
      await connection.execute(
        `INSERT INTO clients (user_id)
         VALUES (?)`,
        [newUserId]
      );
    }

    // Confirmar todas las operaciones
    await connection.commit();

    return {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      rol: userRole,
    };
  } catch (error) {
    // Deshacer todo si alguna operación falla
    await connection.rollback();
      console.error("❌ ERROR EN LA TRANSACCIÓN (SE EJECUTÓ ROLLBACK):");
      console.error("Mensaje:", error.message);
      console.error("Código de Error SQL:", error.code);   // Ej: ER_NO_SUCH_TABLE, ER_BAD_FIELD_ERROR
      console.error("Número de Error SQL:", error.errno); // Ej: 1146, 1054
      console.error("SQL State:", error.sqlState);
    throw error;
  } finally {
    // Liberar la conexión
    connection.release();
  }
};