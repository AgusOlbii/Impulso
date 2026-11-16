import { z } from "zod";

export const createCoachSchema = z.object({
  user_id: z.number().int().positive("ID de usuario inválido"),
  specialty: z.string().min(3, "Especialidad requerida"),
  experience: z.string().min(3, "Detalle de experiencia requerido"),
  price: z.coerce.number().positive("El precio debe ser un monto positivo").optional(),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  image: z.string().url("URL de imagen inválida").optional(),
  position: z.string().optional(),
  available: z.boolean().default(true),
});

export const updateCoachSchema = createCoachSchema.omit({ user_id: true }).partial().extend({
  student_note: z.string().max(600, "La nota es demasiado larga").optional(),
});