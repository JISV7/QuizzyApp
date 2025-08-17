import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'teacher';
}

interface AuthContextType {
  user: User | null;
  register: (registerData: any) => Promise<void>
  login: (loginData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Al cargar la app, intenta obtener los datos del usuario si ya existen
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Función de Register
  const register = async (registerData: any) => {
    const formattedData = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      first_name: registerData.firstName,
      last_name: registerData.lastName,
      role: registerData.role
    };

    await apiClient.post('/register', formattedData);
  };

  // Función de Login
  const login = async (loginData: any) => {
    const response = await apiClient.post('/login', loginData);
    const { user, token } = response.data.data;

    // Guardar en localStorage para persistir la sesión
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', token);

    setUser(user);
    navigate('/dashboard'); // Redirigir al dashboard
  };

  // Función de Logout
  const logout = () => {
    // Limpiar localStorage y estado
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login'); // Redirigir al login
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};