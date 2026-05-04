/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Decode JWT token payload (without verification — just reading claims)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Check if a token is expired
const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // On mount, verify stored token and fetch user profile
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          logout();
          setLoading(false);
          return;
        }

        try {
          const profileRes = await userAPI.getProfile();
          setUser(profileRes.data);
          localStorage.setItem('user', JSON.stringify(profileRes.data));
        } catch {
          // Fallback: decode token to get user info
          const payload = decodeToken(token);
          if (payload && payload.user_id) {
            const userData = {
              id: payload.user_id,
              name: payload.name || '',
              email: payload.email || '',
              role: payload.role || 'user',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };
    initAuth();
    // The initial token check should run once on app boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const accessToken = res.data.access_token;
    localStorage.setItem('token', accessToken);
    setToken(accessToken);

    // Try to fetch full user profile
    try {
      const profileRes = await userAPI.getProfile();
      setUser(profileRes.data);
      localStorage.setItem('user', JSON.stringify(profileRes.data));
      return profileRes.data;
    } catch {
      // Fallback: decode user info from the JWT token itself
      const payload = decodeToken(accessToken);
      const userData = {
        id: payload?.user_id,
        name: payload?.name || '',
        email: payload?.email || email,
        role: payload?.role || 'user',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
  };

  const signup = async (name, email, password, role) => {
    const res = await authAPI.signup(name, email, password, role);
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    setUser,
    decodeToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
