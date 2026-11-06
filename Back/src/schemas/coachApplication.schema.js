import { z } from "zod";

export const createCoachApplicationSchema = z.object({
  user_id: z.coerce.number().int().positive("ID de usuario inválido"),
  specialty: z.string().min(3, "La especialidad debe tener al menos 3 caracteres"),
  experience: z.coerce.number().int().min(0, "La experiencia debe ser un número entero"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"], {
    errorMap: () => ({ message: "El estado debe ser pending, approved o rejected" }),
  }),
});