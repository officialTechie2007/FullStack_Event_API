/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
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
        try {
          const profileRes = await userAPI.getProfile();
          setUser(profileRes.data);
          localStorage.setItem('user', JSON.stringify(profileRes.data));
        } catch {
          logout();
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

    // Fetch user profile
    const profileRes = await userAPI.getProfile();
    setUser(profileRes.data);
    localStorage.setItem('user', JSON.stringify(profileRes.data));

    return profileRes.data;
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
