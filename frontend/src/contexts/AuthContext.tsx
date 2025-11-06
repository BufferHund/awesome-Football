import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authServiceClient, type AuthResponse } from '../services/authService';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthResponse['user']) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从本地存储加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authServiceClient.getUser();
        if (storedUser && authServiceClient.isAuthenticated()) {
          setUser(storedUser);
          // 尝试刷新用户信息
          try {
            await refreshUser();
          } catch (error) {
            // 如果刷新失败，清除用户信息
            console.error('Failed to refresh user:', error);
            setUser(null);
            authServiceClient.logout();
          }
        }
      } catch (error) {
        console.error('Load user error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authServiceClient.login(email, password);
    setUser(response.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await authServiceClient.register(username, email, password);
    setUser(response.user);
  };

  const logout = async () => {
    await authServiceClient.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: AuthResponse['user']) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    if (authServiceClient.isAuthenticated()) {
      const updatedUser = await authServiceClient.getCurrentUser();
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && authServiceClient.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
