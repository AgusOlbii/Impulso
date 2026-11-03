import { z } from "zod";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const createRoutineExerciseSchema = z.object({
  routine_id: z.number().int().positive("ID de rutina inválido"),
  day_of_week: z.enum(daysOfWeek, {
    errorMap: () => ({ message: "Día de la semana inválido" }),
  }),
  exercise_id: z.number().int().positive("ID de ejercicio inválido"),
  target_sets: z.number().int().positive("Las series indicadas deben ser mayores a 0"),
  target_reps: z.number().int().positive("Las repeticiones indicadas deben ser mayores a 0"),
  target_weight: z.number().nonnegative("El peso indicado debe ser 0 o positivo").default(0),
});

// Para cuando el alumno registra el entrenamiento realizado
export const logStudentProgressSchema = z.object({
  actual_sets: z.number().int().nonnegative("Series realizadas inválidas"),
  actual_reps: z.number().int().nonnegative("Repeticiones realizadas inválidas"),
  actual_weight: z.number().nonnegative("Peso realizado inválido"),
  completed: z.boolean().default(true),
});

export const updateRoutineExerciseSchema = createRoutineExerciseSchema
  .omit({ routine_id: true, exercise_id: true })
  .partial();