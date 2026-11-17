import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 1000,
};

export async function authenticateToken(req, res, next) {
  const token = req.cookies?.impulso_token;

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Debés iniciar sesión",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(payload.id);

    if (!user || !user.is_active) {
      res.clearCookie("impulso_token", { ...cookieOptions, maxAge: undefined });
      return res.status(401).json({
        ok: false,
        message: "La sesión ya no es válida",
      });
    }

    req.user = { id: user.id, rol: user.rol };

    if (payload.rol !== user.rol) {
      const tokenNuevo = jwt.sign(
        { id: user.id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.cookie("impulso_token", tokenNuevo, cookieOptions);
    }

    next();
  } catch (error) {
    if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        message: "Sesión inválida o expirada",
      });
    }
    console.error("Error al validar la sesión:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {

    console.log("Usuario decodificado del token:", req.user); // <-- Mira esto en la terminal
    console.log("Roles permitidos para esta ruta:", roles);

    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        message: "No tenés permisos para acceder",
      });
    }

    next();
  };
}
