import { z } from "zod";

export const createRoutineSchema = z.object({
  coach_id: z.number().int().positive("ID de profesor inválido"),
  student_id: z.number().int().positive("ID de alumno inválido"),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de inicio inválida (esperado YYYY-MM-DD)",
  }),
  end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de fin inválida (esperado YYYY-MM-DD)",
  }),
});

export const updateRoutineSchema = createRoutineSchema.omit({ coach_id: true, student_id: true }).partial();