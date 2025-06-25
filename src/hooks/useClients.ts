
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, phone, email')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id'> & { password?: string }) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select('id, name, phone, email')
        .single();

      if (error) throw error;
      setClients(prev => [...prev, data]);
      toast.success('Cliente adicionado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Erro ao adicionar cliente');
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select('id, name, phone, email')
        .single();

      if (error) throw error;
      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));
      toast.success('Cliente atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao remover cliente');
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
