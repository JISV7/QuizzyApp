import jwt from 'jsonwebtoken';
import { findUserById } from '../features/auth/auth.repository.js';

/**
 * Middleware para verificar el JSON Web Token.
 * Extrae el token de las cookies o de la cabecera Authorization.
 * Si el token es válido, adjunta los datos del usuario al objeto `req`.
 */
export const verifyJWT = async (req, res, next) => {
  try {
    // Intenta obtener el token de la cookie 'accessToken' o de la cabecera 'Authorization'
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado. Token no proporcionado." });
    }

    // Verifica el token usando el secreto del .env
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Busca al usuario en la base de datos usando el ID del token decodificado.
    // Esto asegura que el usuario todavía existe y no ha sido eliminado.
    const user = await findUserById(decodedToken?.id);
    
    if (!user) {
        // Si el usuario no se encuentra en la DB, el token ya no es válido.
        return res.status(401).json({ success: false, message: "Token inválido. El usuario ya no existe." });
    }

    // Adjunta el objeto de usuario a la petición para que las siguientes funciones (controladores) puedan usarlo.
    req.user = user;
    next(); // Pasa al siguiente middleware o al controlador.
  } catch (error) {
    // Captura errores de verificación de JWT (ej. token expirado, firma inválida)
    return res.status(401).json({ success: false, message: error?.message || "Token inválido o expirado." });
  }
};
