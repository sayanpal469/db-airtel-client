import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('deshbondhu_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser({ email: 'admin@deshbondhu.com', name: 'Admin User' });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login logic
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@deshbondhu.com' && password === 'admin123') {
          setIsAuthenticated(true);
          setUser({ email, name: 'Admin User' });
          localStorage.setItem('deshbondhu_auth', 'true');
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('deshbondhu_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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
