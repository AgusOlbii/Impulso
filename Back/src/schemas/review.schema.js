import { z } from "zod";

export const createReviewSchema = z.object({
  coach_id: z.number().int().positive("ID de profesor inválido"),
  student_id: z.number().int().positive("ID de alumno inválido"),
  rating: z
    .number()
    .int("El puntaje debe ser un entero")
    .min(1, "El puntaje mínimo es 1")
    .max(5, "El puntaje máximo es 5"),
  comment: z
    .string()
    .min(5, "El comentario debe tener al menos 5 caracteres")
    .max(500, "El comentario no puede superar los 500 caracteres"),
});

export const updateReviewSchema = createReviewSchema.pick({
  rating: true,
  comment: true,
}).partial();