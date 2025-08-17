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
    if (error.response && [401, 403].includes(error.response.status)) {
      // Limpiamos cualquier dato de sesión que pueda haber
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;