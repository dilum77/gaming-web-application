import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, type AuthResponse, type User } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authApi.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    if (response.success && response.data?.user) {
      setUser(response.data.user);
      setIsAuthenticated(true);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        authApi.logout();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user session:', error);
      authApi.logout();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    if (response.success && response.data?.token) {
      handleAuthSuccess(response);
    }
    return response;
  };

  const register = async (username: string, password: string) => {
    const response = await authApi.register(username, password);
    if (response.success && response.data?.token) {
      handleAuthSuccess(response);
    }
    return response;
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
