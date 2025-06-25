
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage for development
    const checkSavedUser = () => {
      const savedUser = localStorage.getItem('barbershop-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkSavedUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
        toast.success('Login realizado com sucesso!');
        return true;
      }

      // Client login using Supabase
      const { data: client, error } = await supabase
        .from('clients')
        .select('id, name, email, phone')
        .eq('email', email)
        .eq('password', password) // Note: In production, use proper password hashing
        .single();

      if (error || !client) {
        toast.error('Email ou senha incorretos');
        return false;
      }

      const userData: User = {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        isAdmin: false
      };
      
      setUser(userData);
      localStorage.setItem('barbershop-user', JSON.stringify(userData));
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      // Check if email already exists
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .single();

      if (existingClient) {
        toast.error('Email já cadastrado');
        return false;
      }

      // Create new client
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([{ name, email, password, phone }])
        .select('id, name, email, phone')
        .single();

      if (error) {
        console.error('Registration error:', error);
        toast.error('Erro ao criar conta');
        return false;
      }

      const userData: User = {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        isAdmin: false
      };
      
      setUser(userData);
      localStorage.setItem('barbershop-user', JSON.stringify(userData));
      toast.success('Conta criada com sucesso!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao criar conta');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barbershop-user');
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
