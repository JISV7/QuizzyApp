import { z } from 'zod';

// Esquema para la creación de un nuevo curso
export const createCourseSchema = z.object({
    body: z.object({
        name: z.string().min(3, "El nombre del curso es requerido."),
        description: z.string().optional(),
        code: z.string().optional(),
  }),
});

// Esquema para invitar a un estudiante a un curso
export const inviteStudentSchema = z.object({
    body: z.object({
        username: z.string().min(1, "El nombre de usuario del estudiante es requerido."),
    }),
    params: z.object({
        courseId: z.string().regex(/^\d+$/, "El ID del curso debe ser un número."),
    }),
});