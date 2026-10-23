import { z } from "zod";

export const createNotificationSchema = z.object({
  user_id: z.number().int().positive("ID de usuario inválido"),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres"),
  type: z
    .enum(["info", "success", "warning", "error", "application_approved", "routine_assigned", "review_received", "payment_escrow", "payment_completed", "payment_refunded"])
    .default("info"),
});

export const markAsReadSchema = z.object({
  is_read: z.boolean().default(true),
});