import { z } from 'zod';

export const courseParamsSchema = z.object({
  params: z.object({
    courseId: z.string().regex(/^\d+$/, 'El ID del curso debe ser un número.'),
  }),
});

export const assignmentParamsSchema = z.object({
  params: z.object({
    assignmentId: z.string().regex(/^\d+$/, 'El ID de la asignación debe ser un número.'),
  }),
});

export const submissionParamsSchema = z.object({
    params: z.object({
        submissionId: z.string().regex(/^\d+$/, 'El ID de la entrega debe ser un número.'),
    }),
});