import * as authService from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 1000,
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    // 1. Validaciones básicas de entrada HTTP
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email y contraseña son obligatorios",
      });
    }

    // 2. Llama al servicio para hacer la lógica pesada
    const { token, user } = await authService.loginUser(email.trim(), password);

    // 3. Responde HTTP con la cookie
    res.cookie("impulso_token", token, cookieOptions);

    return res.json({
      ok: true,
      message: "Inicio de sesión exitoso",
      user,
    });
  } catch (error) {
    // Si el servicio lanza un error de credenciales
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        ok: false,
        message: "Email o contraseña incorrectos",
      });
    }

    console.error("Error en login:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user || !user.is_active) {
      res.clearCookie("impulso_token", { ...cookieOptions, maxAge: undefined });
      return res.status(401).json({
        ok: false,
        message: "La sesión ya no es válida",
      });
    }

    return res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Error verificando sesión:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("impulso_token", { ...cookieOptions, maxAge: undefined });
  return res.json({
    ok: true,
    message: "Sesión cerrada correctamente",
  });
};


export const register = async (req, res) => {
  try {
    const { name, email, password, rol, phone, dni } = req.body;

    const user = await authService.registerUser({ 
      name, 
      email, 
      password, 
      rol, 
      phone, 
      dni 
    });

    return res.status(201).json({
      ok: true,
      message: user.rol === "coach" 
        ? "Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador."
        : "Usuario registrado con éxito",
      user,
    });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        ok: false,
        message: "El correo electrónico ya se encuentra registrado",
      });
    }

    console.error("Error en el registro:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor al procesar el registro",
    });
  }
};