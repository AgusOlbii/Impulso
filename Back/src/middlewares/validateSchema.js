// src/middlewares/validateSchema.js
export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.errors[0].message 
    });
  }
};