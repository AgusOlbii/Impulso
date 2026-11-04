import { z } from "zod";

// Días de la semana permitidos (coincide con tu ENUM de la base de datos)
const DAYS_OF_WEEK = [
  "Lunes", 
  "Martes", 
  "Miércoles", 
  "Jueves", 
  "Viernes", 
  "Sábado", 
  "Domingo"
];

// Esquema para cada ejercicio individual dentro de la rutina
const routineExerciseSchema = z.object({
  exercise_id: z.number().int().positive("El ID del ejercicio es obligatorio"),
  day_of_week: z.enum(DAYS_OF_WEEK, { 
    errorMap: () => ({ message: "Día de la semana no válido" }) 
  }),
  target_sets: z.number().int().positive("Las series deben ser mayor a 0"),
  target_reps: z.number().int().positive("Las repeticiones deben ser mayor a 0"),
  target_weight: z.number().min(0, "El peso no puede ser negativo").default(0),
});

// Esquema principal para crear la rutina completa
export const createRoutineSchema = z.object({
  student_id: z.number().int().positive("El ID del alumno es obligatorio"),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de inicio debe tener formato YYYY-MM-DD"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de fin debe tener formato YYYY-MM-DD"),
  
  // La rutina debe venir obligatoriamente con un array de ejercicios
  exercises: z.array(routineExerciseSchema).min(1, "La rutina debe incluir al menos un ejercicio"),
});