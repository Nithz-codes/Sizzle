import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authApi, LoginPayload, RegisterPayload, UpdateProfilePayload, ChangePasswordPayload } from '../services/api';
import { isTokenExpired } from '../utils/jwt';

export type AuthTab = 'customer-login' | 'customer-register' | 'admin-login';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;
  authTab: AuthTab;
  isLoading: boolean;
  error: string | null;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  setAuthTab: (tab: AuthTab) => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('sizzle_auth_token');
    return savedToken && !isTokenExpired(savedToken) ? savedToken : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sizzle_user');
    const savedToken = localStorage.getItem('sizzle_auth_token');
    if (savedToken && !isTokenExpired(savedToken) && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<AuthTab>('customer-login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to completely purge previous authentication sessions (Fixes Bug 2 session contamination)
  const purgeSession = () => {
    setToken(null);
    setUser(null);
    setIsProfileModalOpen(false);
    localStorage.removeItem('sizzle_auth_token');
    localStorage.removeItem('sizzle_user');
  };

  // Validate token on mount if present (Fixes Bug 1 protected route leakage)
  useEffect(() => {
    const validateSessionOnBoot = async () => {
      const savedToken = localStorage.getItem('sizzle_auth_token');
      if (savedToken) {
        if (isTokenExpired(savedToken)) {
          purgeSession();
        } else {
          try {
            const res = await authApi.getProfile();
            if (res.success && res.data) {
              setUser(res.data);
              setToken(savedToken);
              localStorage.setItem('sizzle_user', JSON.stringify(res.data));
            } else {
              purgeSession();
            }
          } catch {
            purgeSession();
          }
        }
      } else {
        purgeSession();
      }
      setIsInitializing(false);
    };

    validateSessionOnBoot();
  }, []);

  const openAuthModal = (tab: AuthTab = 'customer-login') => {
    setAuthTab(tab);
    setError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setError(null);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const clearError = () => {
    setError(null);
  };

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    // FIX BUG 2: Mandatory explicit session purge before setting new login credentials
    purgeSession();

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
      purgeSession();
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    // FIX BUG 2: Mandatory explicit session purge before setting new registration credentials
    purgeSession();

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
      purgeSession();
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.updateProfile(payload);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('sizzle_user', JSON.stringify(res.data));
        return res.data;
      } else {
        throw new Error(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Profile update failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.changePassword(payload);
      if (!res.success) {
        throw new Error(res.message || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.message || 'Password change failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    purgeSession();
  };

  const isAuthenticated = !!token && !!user && !isTokenExpired(token);
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isInitializing,
        isAuthModalOpen,
        isProfileModalOpen,
        authTab,
        isLoading,
        error,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        setAuthTab,
        login,
        register,
        updateProfile,
        changePassword,
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
