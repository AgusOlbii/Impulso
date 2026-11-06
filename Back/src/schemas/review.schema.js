import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("El puntaje debe ser un entero")
    .min(1, "El puntaje mínimo es 1")
    .max(5, "El puntaje máximo es 5"),
  comment: z
    .string()
    .max(500, "El comentario no puede superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
});
