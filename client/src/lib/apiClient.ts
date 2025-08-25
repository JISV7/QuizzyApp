import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, no hacemos nada
  (error) => {
    // Si el error es 401 (No Autorizado) o 403 (Prohibido)
    // Y NO estamos ya en la página de login o registro
    if (error.response && [401, 403].includes(error.response.status) && 
        window.location.pathname !== '/login' && 
        window.location.pathname !== '/register') {
      
      // Limpiamos cualquier dato de sesión que pueda haber
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');

      // Forzamos la recarga solo si el usuario NO estaba en login
      window.location.href = '/login';
    }

    // Para todos los demás errores (incluyendo un 401 en la página de login),
    // simplemente dejamos que el error continúe para que sea manejado por el componente.
    return Promise.reject(error);
  }
);

export default apiClient;