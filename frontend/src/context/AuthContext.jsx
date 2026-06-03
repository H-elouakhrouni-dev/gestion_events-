import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAuthToken } from '../api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'eventmaster_token';
const USER_KEY = 'eventmaster_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async ({ nom, prenom, email, password, password_confirmation }) => {
    const payload = {
      nom,
      prenom,
      email,
      password,
      password_confirmation,
    };
    
    const res = await api.post('/register', payload);
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
    } finally {
      clearSession();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .get('/user')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [clearSession]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
