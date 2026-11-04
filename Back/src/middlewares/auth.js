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
