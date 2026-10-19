import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies?.impulso_token;

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Debés iniciar sesión",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      ok: false,
      message: "Sesión inválida o expirada",
    });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        message: "No tenés permisos para acceder",
      });
    }

    next();
  };
}

// middlewares/validateRegister.js
// export const validateRegisterInput = (req, res, next) => {
//   const { name, email, password, rol, phone, dni } = req.body ?? {};
//   // Validaciones de presencia y tipo
//   if (!name || typeof name !== "string" || !name.trim()) {
//     return res.status(400).json({
//       ok: false,
//       message: "El nombre es obligatorio",
//     });
//   }

//   // Validar DNI
//   if (!dni) {
//     return res.status(400).json({
//       ok: false,
//       message: "El DNI es obligatorio",
//     });
//   }

//   // Validar Teléfono
//   if (!phone) {
//     return res.status(400).json({
//       ok: false,
//       message: "El teléfono es obligatorio",
//     });
//   }

//   if (!email || typeof email !== "string" || !email.trim()) {
//     return res.status(400).json({
//       ok: false,
//       message: "El correo electrónico es obligatorio",
//     });
//   }

//   // Validar formato de email simple
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email.trim())) {
//     return res.status(400).json({
//       ok: false,
//       message: "El correo electrónico no tiene un formato válido",
//     });
//   }

//   if (!password || typeof password !== "string" || password.length < 6) {
//     return res.status(400).json({
//       ok: false,
//       message: "La contraseña debe tener al menos 6 caracteres",
//     });
//   }

//   // Validar que el rol sea uno de los permitidos (evitar que se registren como 'admin' directamente)
//   const allowedRoles = ["alumno", "profesor"];
//   if (rol && !allowedRoles.includes(rol)) {
//     return res.status(400).json({
//       ok: false,
//       message: "El rol seleccionado no es válido para el registro público",
//     });
//   }

//   next();
// };