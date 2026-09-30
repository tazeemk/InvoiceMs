// src/auth/authProvider.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAccessToken,
  clearAuthCookies
} from '@/lib/cookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    setAuthenticated(!!token);
  }, []);

  const logout = () => {
    clearAuthCookies();
    setAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
