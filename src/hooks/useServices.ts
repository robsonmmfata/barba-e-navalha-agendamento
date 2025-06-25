
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      setServices(prev => [...prev, data]);
      toast.success('Serviço adicionado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Erro ao adicionar serviço');
      throw error;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setServices(prev => prev.map(service => 
        service.id === id ? data : service
      ));
      toast.success('Serviço atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Erro ao atualizar serviço');
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setServices(prev => prev.filter(service => service.id !== id));
      toast.success('Serviço removido com sucesso!');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao remover serviço');
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    addService,
    updateService,
    deleteService,
    refetch: fetchServices
  };
};
