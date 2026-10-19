import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }).trim().min(1, "El nombre es obligatorio"),
  dni: z.string({ required_error: "El DNI es obligatorio" }).trim().min(1, "El DNI es obligatorio"),
  phone: z.string({ required_error: "El teléfono es obligatorio" }).trim().min(1, "El teléfono es obligatorio"),
  email: z.string({ required_error: "El correo es obligatorio" }).email("El correo electrónico no tiene un formato válido"),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["alumno", "profesor"], {
    message: "El rol seleccionado no es válido para el registro público"
  }).optional()
});