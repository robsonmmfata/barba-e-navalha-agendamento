
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('barbershop-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin login
    if (email === 'admin@barbearia.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin',
        name: 'Administrador',
        email: 'admin@barbearia.com',
        phone: '',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('barbershop-user', JSON.stringify(adminUser));
      return true;
    }

    // Client login (simulate checking against stored clients)
    const clients = JSON.parse(localStorage.getItem('barbershop-clients') || '[]');
    const client = clients.find((c: any) => c.email === email);
    
    if (client) {
      const userData: User = {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        isAdmin: false
      };
      setUser(userData);
      localStorage.setItem('barbershop-user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      const clients = JSON.parse(localStorage.getItem('barbershop-clients') || '[]');
      
      // Check if email already exists
      if (clients.some((c: any) => c.email === email)) {
        return false;
      }

      const newClient = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password // In a real app, this would be hashed
      };

      clients.push(newClient);
      localStorage.setItem('barbershop-clients', JSON.stringify(clients));

      const userData: User = {
        id: newClient.id,
        name,
        email,
        phone,
        isAdmin: false
      };
      setUser(userData);
      localStorage.setItem('barbershop-user', JSON.stringify(userData));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barbershop-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};
