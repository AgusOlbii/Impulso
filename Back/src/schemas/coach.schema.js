import { z } from "zod";

export const createCoachSchema = z.object({
  user_id: z.number().int().positive("ID de usuario inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  specialty: z.string().min(3, "Especialidad requerida"),
  experience: z.string().min(3, "Detalle de experiencia requerido"),
  price: z.number().positive("El precio debe ser un monto positivo"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  image: z.string().url("URL de imagen inválida").optional(),
  position: z.string().optional(),
  available: z.boolean().default(true),
});

export const updateCoachSchema = createCoachSchema.omit({ user_id: true }).partial();