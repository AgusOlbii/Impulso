import { z } from "zod";

export const createStudentSchema = z.object({
  user_id: z.number().int().positive("ID de usuario inválido"),
  weight: z.number().positive("El peso debe ser un número positivo"),
  height: z.number().positive("La altura debe ser un número positivo"),
  goal: z.string().min(3, "El objetivo debe tener al menos 3 caracteres"),
  medical_notes: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.omit({ user_id: true }).partial();