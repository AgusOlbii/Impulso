import { z } from "zod";

const MUSCLE_GROUPS = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Antebrazos",
  "Tríceps",
  "Abdominales",
  "Cuadricep",
  "Isquiotibiales",
  "Gluteos",
  "Gemelos",
  "Abductores / Aductores",
  "Cardio",
  "Fullbody"
];

export const createExerciseSchema = z.object({
  name: z.string().min(2, "El nombre del ejercicio debe tener al menos 2 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres").optional(),
  muscle_group: z.enum([...MUSCLE_GROUPS], {
    errorMap: () => ({ message: "Grupo muscular no válido" })
  }),
  video_url: z.string().url("URL de video inválida").optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();