import { z } from "zod";

export const createPaymentSchema = z.object({
  student_id: z.number().int().positive("ID de alumno inválido"),
  coach_id: z.number().int().positive("ID de profesor inválido"),
  amount: z.number().positive("El monto debe ser un valor positivo"),
  platform_fee_percentage: z
    .number()
    .min(0)
    .max(100)
    .default(10), // Porcentaje de comisión por defecto (ej: 10%)
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["pending", "escrow", "completed", "refunded", "failed"], {
    errorMap: () => ({ message: "Estado de pago inválido" }),
  }),
});