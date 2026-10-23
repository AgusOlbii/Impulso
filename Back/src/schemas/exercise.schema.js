import { z } from "zod";

export const createExerciseSchema = z.object({
  name: z.string().min(2, "El nombre del ejercicio debe tener al menos 2 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres").optional(),
  muscle_group: z.string().min(2, "El grupo muscular es requerido"),
  video_url: z.string().url("URL de video inválida").optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();