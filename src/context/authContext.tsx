'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as loginApi, register as registerApi } from '@/lib/apiServices/authApi';
import { parseJwt, isTokenExpired } from '@/lib/jwt';

export interface AuthUser {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthLoaded: boolean; 
  login: (credentials: { email: string; pass: string }) => Promise<void>;
  register: (data: { name: string; phone: string; email: string; pass: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'token';

function userFromToken(token: string): AuthUser | null {
  const decoded = parseJwt(token);
  if (!decoded || isTokenExpired(decoded)) return null;
  return {
    name: decoded.name || 'Користувач',
    email: decoded.email || '',
    isAdmin: decoded.role === 'Admin',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const decodedUser = userFromToken(stored);
      if (decodedUser) {
        setToken(stored);
        setUser(decodedUser);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsAuthLoaded(true);
  }, []);

  const applyToken = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(userFromToken(newToken));
  }, []);

  const login = useCallback(
    async ({ email, pass }: { email: string; pass: string }) => {
      const data = await loginApi(email, pass);
      applyToken(data.token);
    },
    [applyToken]
  );

  const register = useCallback(
    async ({ name, phone, email, pass }: { name: string; phone: string; email: string; pass: string }) => {
      await registerApi(name, phone, email, pass);
      await login({ email, pass });
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthLoaded, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}