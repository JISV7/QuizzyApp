import { z } from 'zod';

// Esquema para una opción de respuesta
const optionSchema = z.object({
  option_text: z.string().min(1, 'El texto de la opción no puede estar vacío.'),
  is_correct: z.boolean(),
});

// Esquema para añadir una nueva pregunta a un quiz
export const addQuestionSchema = z.object({
  body: z.object({
    question_text: z.string().min(1, 'El texto de la pregunta es requerido.'),
    points: z.number().int().positive('Los puntos deben ser un número entero positivo.'),
    options: z.array(optionSchema)
      .min(2, 'La pregunta debe tener al menos dos opciones.')
      .refine(options => options.filter(opt => opt.is_correct).length === 1, {
        message: 'Debe haber exactamente una respuesta correcta.',
      }),
  }),
  params: z.object({
    assignmentId: z.string().regex(/^\d+$/, 'El ID de la asignación debe ser un número.'),
  }),
});

// Esquema para actualizar una pregunta
export const updateQuestionSchema = addQuestionSchema.omit({ params: true }).extend({
    params: z.object({
        questionId: z.string().regex(/^\d+$/, 'El ID de la pregunta debe ser un número.'),
    })
});