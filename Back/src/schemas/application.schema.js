import { z } from "zod";

export const createApplicationSchema = z.object({
  specialty: z.string({
    required_error: "La especialidad es obligatoria",
  }),
  experience: z.string({
    required_error: "La experiencia es obligatoria",
  }),
  description: z.string({
    required_error: "La descripción es obligatoria",
  }),
  price: z.number({
    required_error: "El precio es obligatorio",
  }),
});