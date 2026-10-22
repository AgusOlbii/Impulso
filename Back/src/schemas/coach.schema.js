// src/schemas/coach.schema.js
import { z } from "zod";

export const createCoachSchema = z.object({
  name: z.string({
    required_error: "El nombre es obligatorio",
  }),
  specialty: z.string({
    required_error: "La especialidad es obligatoria",
  }),
  experience: z.string({
    required_error: "La experiencia es obligatoria",
  }),
  price: z.number({
    required_error: "El precio es obligatorio",
  }),
  description: z.string({
    required_error: "La descripción es obligatoria",
  }),
  image: z.string({
    required_error: "La imagen es obligatoria",
  }),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  position: z.string().optional(),
  available: z.boolean().optional(),
});