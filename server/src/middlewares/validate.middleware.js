/**
 * Middleware genérico para validar peticiones usando un esquema de Zod.
 * @param {object} schema - El esquema de Zod a validar.
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      const errorMessages = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ success: false, message: errorMessages });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error("Validation Middleware - Unexpected Error:", error);
    }
    
    return res.status(400).json({ success: false, message: error.message || 'Error de validación inesperado.' });
  }
};