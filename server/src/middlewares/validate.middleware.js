/**
 * Middleware genérico para validar peticiones usando un esquema de Zod.
 * @param {object} schema - El esquema de Zod a validar.
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    // Intenta parsear y validar el cuerpo, los parámetros y las queries de la petición.
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Si la validación es exitosa, pasa al siguiente middleware o al controlador.
    return next();
  } catch (error) {
    // Si la validación falla, Zod emite un error con detalles.
    // Extraemos los mensajes de error y los enviamos en la respuesta.
    const errorMessages = error.errors.map(e => e.message).join(', ');
    return res.status(400).json({ success: false, message: errorMessages });
  }
};