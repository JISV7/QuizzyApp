import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserByUsername } from './auth.repository.js';

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario del controlador.
 */
/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario del controlador.
 */
export const registerUser = async (userData) => {
  const { email, username, password, role } = userData;

  // 1. Verificar si el email ya existe
  const existingUserByEmail = await findUserByEmail(email);
  if (existingUserByEmail) {
    throw new Error('USER_EMAIL_EXISTS');
  }

  // 2. Verificar si el username ya existe
  const existingUserByUsername = await findUserByUsername(username);
  if (existingUserByUsername) {
    throw new Error('USER_USERNAME_EXISTS');
  }

  // 3. Hashear la contraseña
  const password_hash = await bcrypt.hash(password, 10);

  // 4. Crear el usuario en la base de datos
  await createUser({ ...userData, password_hash, role: role || 'student' });

  // 5. Devolver el usuario recién creado (sin la contraseña)
  const newUser = await findUserByEmail(email);
  delete newUser.password_hash;
  return newUser;
};

/**
 * Autentica un usuario y devuelve un token.
 * @param {object} loginData - Credenciales del usuario.
 */
export const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // 1. Encontrar al usuario
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 2. Comparar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 3. Generar el token JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  // 4. Preparar los datos del usuario para devolver
  delete user.password_hash;
  return { user, token };
};