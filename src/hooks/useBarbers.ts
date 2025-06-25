
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  experience: string;
}

export const useBarbers = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .order('name');

      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast.error('Erro ao carregar barbeiros');
    } finally {
      setLoading(false);
    }
  };

  const addBarber = async (barber: Omit<Barber, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .insert([barber])
        .select()
        .single();

      if (error) throw error;
      setBarbers(prev => [...prev, data]);
      toast.success('Barbeiro adicionado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding barber:', error);
      toast.error('Erro ao adicionar barbeiro');
      throw error;
    }
  };

  const updateBarber = async (id: string, updates: Partial<Barber>) => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBarbers(prev => prev.map(barber => 
        barber.id === id ? data : barber
      ));
      toast.success('Barbeiro atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error updating barber:', error);
      toast.error('Erro ao atualizar barbeiro');
      throw error;
    }
  };

  const deleteBarber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBarbers(prev => prev.filter(barber => barber.id !== id));
      toast.success('Barbeiro removido com sucesso!');
    } catch (error) {
      console.error('Error deleting barber:', error);
      toast.error('Erro ao remover barbeiro');
      throw error;
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  return {
    barbers,
    loading,
    addBarber,
    updateBarber,
    deleteBarber,
    refetch: fetchBarbers
  };
};
