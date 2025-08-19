import { z } from 'zod';

// Esquema para el registro de un nuevo usuario
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres."),
    email: z.string().email("El formato del email no es válido."),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    first_name: z.string().min(1, "El nombre es requerido."),
    last_name: z.string().min(1, "El apellido es requerido."),
    role: z.enum(['student', 'teacher']).optional(),
  }),
});

// Esquema para el inicio de sesión
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("El formato del email no es válido."),
    password: z.string().min(1, "La contraseña es requerida."),
  }),
});