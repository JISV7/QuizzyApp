/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos.
 * Debe usarse SIEMPRE después de verifyJWT.
 * @param {...string} allowedRoles - Los roles permitidos para acceder a la ruta.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user es adjuntado por el middleware verifyJWT
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Acceso prohibido. No tienes los permisos necesarios."
      });
    }
    next();
  };
};