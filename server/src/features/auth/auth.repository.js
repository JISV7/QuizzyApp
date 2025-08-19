import { pool } from '../../config/database.js';

/**
 * Busca un usuario por su dirección de email.
 * @param {string} email - El email del usuario a buscar.
 * @returns {Promise<object|null>} El usuario si se encuentra, de lo contrario null.
 */
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

/**
 * @param {string} username - El nombre de usuario a buscar.
 * @returns {Promise<object|null>} El usuario si se encuentra.
 */
export const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0] || null;
};

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Datos del usuario.
 * @returns {Promise<object>} El resultado de la inserción.
 */
export const createUser = async (userData) => {
  const { username, email, password_hash, first_name, last_name, role } = userData;
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, password_hash, first_name, last_name, role]
  );
  return result;
};

/**
 * Busca un usuario por su ID.
 * @param {number} id - El ID del usuario.
 * @returns {Promise<object|null>} El usuario si se encuentra.
 */
export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, email, username, role, first_name, last_name FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};