import { z } from "zod";

export const createReviewSchema = z.object({
  coach_id: z.coerce.number().int().positive("ID de profesor inválido"),
  rating: z
    .coerce.number()
    .int("El puntaje debe ser un entero")
    .min(1, "El puntaje mínimo es 1")
    .max(5, "El puntaje máximo es 5"),
  comment: z
    .string()
    .max(500, "El comentario no puede superar los 500 caracteres")
    .optional()
    .default(""),
});

export const updateReviewSchema = createReviewSchema.pick({
  rating: true,
  comment: true,
}).partial();