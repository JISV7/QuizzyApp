import { registerUser, loginUser } from './auth.service.js';

export const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito',
      data: newUser
    });
  } catch (error) {
    if (error.message === 'USER_EMAIL_EXISTS') {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está en uso.' });
    }
    if (error.message === 'USER_USERNAME_EXISTS') {
      return res.status(409).json({ success: false, message: 'El nombre de usuario ya está en uso.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    
    // Configurar la cookie con el token
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    res
      .status(200)
      .cookie('accessToken', token, options)
      .json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { user, token }
      });
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const logout = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json({
      success: true,
      message: "Cierre de sesión exitoso"
    });
};