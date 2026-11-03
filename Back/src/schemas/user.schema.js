import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastname: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["student", "coach", "admin"]).default("student"),
  phone: z.string().optional(),
  dni: z.string().min(6, "DNI inválido"),
  birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de nacimiento inválida (esperado YYYY-MM-DD)",
  }).optional(),
  is_active: z.coerce.boolean().default(true).optional(),
  image_url: z.string().url("URL de imagen inválida").optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const updateUserSchema = registerUserSchema.partial();