import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, AdminData } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const response = await authApi.getProfile();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedAuthData = localStorage.getItem('deshbondhu_auth_data');
      if (storedAuthData) {
        try {
          const authData = JSON.parse(storedAuthData);
          if (authData.token) {
            setIsAuthenticated(true);
            setUser(authData);
            // Verify token/refresh profile
            await refreshProfile();
          }
        } catch (e) {
          localStorage.removeItem('deshbondhu_auth_data');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        const adminData = response.data;
        setIsAuthenticated(true);
        setUser(adminData);
        localStorage.setItem('deshbondhu_auth_data', JSON.stringify(adminData));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('deshbondhu_auth_data');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
