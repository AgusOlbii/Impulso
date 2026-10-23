import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { CoachModel } from "../models/coach.model.js";
import { StudentModel } from "../models/student.model.js";
import { boolean } from "zod";

export const loginUser = async (email, password) => {
  // 1. Buscar usuario usando el modelo (ya filtra por is_active = TRUE)
  const user = await UserModel.findByEmail(email);

  // 2. Comprobar existencia y contraseña
  if (!user || !(await bcrypt.compare(password, user.password))) {
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
      lastname: user.lastname,
      email: user.email,
      rol: user.rol,
    },
  };
};

export const getUserById = async (userId) => {
  const user = await UserModel.findById(userId);
  return user;
};

export const registerUser = async ({ name, lastname, email, password, rol, phone, dni, is_active, image_url }) => {
  // 1. Normalizar los datos
  const cleanName = name.trim();
  const cleanLastname = lastname ? lastname.trim() : "";
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = String(phone ?? "").trim();
  const cleanDni = String(dni ?? "").trim();
  const cleanIsActive = is_active ?? true;

  // 2. Validar el rol
  const userRole = rol || "student";

  if (!["student", "coach"].includes(userRole)) {
    throw new Error("INVALID_ROLE");
  }

  // 3. Verificar si el email ya existe
  const existingUser = await UserModel.findByEmail(cleanEmail);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

   // 4. Verificar si el email ya existe
  const existingDNI = await UserModel.findByDni(cleanDni);
  if (existingDNI) {
    throw new Error("DNI_ALREADY_EXISTS");
  }
  // 5. Encriptar la contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 6. Crear el usuario y su perfil correspondiente
  try {
    const newUser = await UserModel.create({
      name: cleanName,
      lastname: cleanLastname,
      email: cleanEmail,
      password: hashedPassword,
      rol: userRole,
      phone: cleanPhone || null,
      dni: cleanDni,
      is_active: cleanIsActive,
      image_url: image_url || null,
    });

    // Crear el perfil específico para ESTUDIANTE
    await StudentModel.create({ user_id: newUser.id });
    

    return newUser;
  } catch (error) {
    console.error("❌ ERROR EN EL REGISTRO DE USUARIO:");
    console.error("Mensaje:", error.message);
    throw error;
  }
};