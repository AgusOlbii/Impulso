export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // En Zod, los errores de validación vienen en .issues, no de .errors
    if (error.issues && error.issues.length > 0) {
      const specificMessage = error.issues[0].message;
      return res.status(400).json({ message: specificMessage });
    }
    
    // Fallback por si acaso
    return res.status(400).json({ message: error.message || "Datos inválidos" });
  }
};