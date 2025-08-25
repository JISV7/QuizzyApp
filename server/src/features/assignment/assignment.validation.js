import { z } from 'zod';

// Esquema para crear una nueva asignación de tipo quiz
export const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(1, "El título es requerido."),
    description: z.string().optional(),
    type: z.enum(['quiz', 'material', 'task'], {
        errorMap: () => ({ message: "El tipo de asignación no es válido." })
    }),
    max_points: z.number().nonnegative("Los puntos no pueden ser negativos.").optional(),
    open_date: z.string().datetime({ message: "La fecha de apertura debe tener un formato válido." }),
    close_date: z.string().datetime({ message: "La fecha de cierre debe tener un formato válido." }),
    allow_late_submissions: z.boolean().optional(),
  }).superRefine((data, ctx) => {
    if (data.type === 'quiz') {
      if (data.max_points !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Una asignación de tipo 'quiz' no debe tener 'max_points'. El total se calcula a partir de las preguntas.",
          path: ['max_points'],
        });
      }
    } else { // Si es 'task', 'material', etc.
      if (data.max_points === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El campo 'max_points' es requerido para asignaciones que no son de tipo 'quiz'.",
          path: ['max_points'],
        });
      }
    }
  }),
  params: z.object({
    courseId: z.string().regex(/^\d+$/, "El ID del curso debe ser un número."),
  }),
});

// Esquema para la respuesta de un estudiante a una pregunta
const studentAnswerSchema = z.object({
  question_id: z.number().int().positive('El ID de la pregunta no es válido.'),
  selected_option_id: z.number().int().positive('El ID de la opción seleccionada no es válido.'),
});

// Esquema para entregar un quiz
export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(studentAnswerSchema).min(1, 'Debes proporcionar al menos una respuesta.'),
  }),
  params: z.object({
    assignmentId: z.string().regex(/^\d+$/, 'El ID de la asignación debe ser un número.'),
  }),
});