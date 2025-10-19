import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('userName');
  });

  useEffect(() => {
    if (userName) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
    }
  }, [userName]);

  const login = (name: string) => {
    setUserName(name);
  };

  const logout = () => {
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
