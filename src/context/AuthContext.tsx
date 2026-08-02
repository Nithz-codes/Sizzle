import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authApi, LoginPayload, RegisterPayload } from '../services/api';

export type AuthTab = 'customer-login' | 'customer-register' | 'admin-login';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authTab: AuthTab;
  isLoading: boolean;
  error: string | null;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  setAuthTab: (tab: AuthTab) => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sizzle_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sizzle_auth_token');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<AuthTab>('customer-login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validate token on mount if present
  useEffect(() => {
    if (token && !user) {
      authApi.getProfile()
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('sizzle_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, [token, user]);

  const openAuthModal = (tab: AuthTab = 'customer-login') => {
    setAuthTab(tab);
    setError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login(payload);
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData as User);
        localStorage.setItem('sizzle_auth_token', jwtToken);
        localStorage.setItem('sizzle_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData as User);
        localStorage.setItem('sizzle_auth_token', jwtToken);
        localStorage.setItem('sizzle_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sizzle_auth_token');
    localStorage.removeItem('sizzle_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isAuthModalOpen,
        authTab,
        isLoading,
        error,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
