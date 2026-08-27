import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gts_user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Error reading gts_user from localStorage:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('gts_access_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('gts_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session restoration failed:', err.message);
          // Interceptor handles refresh or cleanup
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, mfaCode = null) => {
    const res = await authApi.login({ email, password, mfaCode });
    if (res.data?.requiresMfa) {
      return { requiresMfa: true, tempUserId: res.data.tempUserId };
    }

    if (res.data?.success && res.data?.data) {
      const { user: userData, accessToken, refreshToken } = res.data.data;
      setUser(userData);
      localStorage.setItem('gts_user', JSON.stringify(userData));
      localStorage.setItem('gts_access_token', accessToken);
      localStorage.setItem('gts_refresh_token', refreshToken);
      return { success: true, user: userData };
    }

    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res.data?.success && res.data?.data) {
      const { user: userData, accessToken, refreshToken } = res.data.data;
      setUser(userData);
      localStorage.setItem('gts_user', JSON.stringify(userData));
      localStorage.setItem('gts_access_token', accessToken);
      localStorage.setItem('gts_refresh_token', refreshToken);
      return { success: true, user: userData };
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gts_user');
    localStorage.removeItem('gts_access_token');
    localStorage.removeItem('gts_refresh_token');
    window.location.href = '/login';
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('gts_user', JSON.stringify(updatedUser));
  };

  const isInternalAdmin = user?.role === 'INTERNAL_ADMIN';
  const isOrgAdmin = user?.role === 'ORG_ADMIN' || isInternalAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
        isInternalAdmin,
        isOrgAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
