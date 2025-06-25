
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  participants: string[];
  status: 'ativo' | 'encerrado' | 'sorteado';
  winner?: string;
}

export const useRaffles = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRaffles = async () => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setRaffles(data || []);
    } catch (error) {
      console.error('Error fetching raffles:', error);
      toast.error('Erro ao carregar sorteios');
    } finally {
      setLoading(false);
    }
  };

  const addRaffle = async (raffle: Omit<Raffle, 'id' | 'participants' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .insert([{
          ...raffle,
          participants: [],
          status: 'ativo'
        }])
        .select()
        .single();

      if (error) throw error;
      setRaffles(prev => [data, ...prev]);
      toast.success('Sorteio criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding raffle:', error);
      toast.error('Erro ao criar sorteio');
      throw error;
    }
  };

  const updateRaffle = async (id: string, updates: Partial<Raffle>) => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRaffles(prev => prev.map(raffle => 
        raffle.id === id ? data : raffle
      ));
      toast.success('Sorteio atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error updating raffle:', error);
      toast.error('Erro ao atualizar sorteio');
      throw error;
    }
  };

  const deleteRaffle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('raffles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRaffles(prev => prev.filter(raffle => raffle.id !== id));
      toast.success('Sorteio removido com sucesso!');
    } catch (error) {
      console.error('Error deleting raffle:', error);
      toast.error('Erro ao remover sorteio');
      throw error;
    }
  };

  const participateInRaffle = async (raffleId: string, participantName: string, participantPhone: string) => {
    try {
      const raffle = raffles.find(r => r.id === raffleId);
      if (!raffle || raffle.status !== 'ativo') return false;
      if (raffle.participants.length >= raffle.max_participants) return false;
      if (new Date() > new Date(raffle.end_date)) return false;

      const participantKey = `${participantName}-${participantPhone}`;
      if (raffle.participants.includes(participantKey)) return false;

      const updatedParticipants = [...raffle.participants, participantKey];
      await updateRaffle(raffleId, { participants: updatedParticipants });
      return true;
    } catch (error) {
      console.error('Error participating in raffle:', error);
      toast.error('Erro ao participar do sorteio');
      return false;
    }
  };

  const drawRaffleWinner = async (raffleId: string) => {
    try {
      const raffle = raffles.find(r => r.id === raffleId);
      if (!raffle || raffle.participants.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * raffle.participants.length);
      const winner = raffle.participants[randomIndex];

      await updateRaffle(raffleId, {
        winner,
        status: 'sorteado'
      });

      return winner;
    } catch (error) {
      console.error('Error drawing raffle winner:', error);
      toast.error('Erro ao sortear ganhador');
      return null;
    }
  };

  useEffect(() => {
    fetchRaffles();
  }, []);

  return {
    raffles,
    loading,
    addRaffle,
    updateRaffle,
    deleteRaffle,
    participateInRaffle,
    drawRaffleWinner,
    refetch: fetchRaffles
  };
};
