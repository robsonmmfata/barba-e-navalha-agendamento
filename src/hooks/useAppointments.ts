
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Appointment {
  id: string;
  client_id: string;
  barber_id: string;
  service_id: string;
  date: string;
  time: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setAppointments(data?.map(item => ({
        ...item,
        status: item.status as 'agendado' | 'concluido' | 'cancelado'
      })) || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;
      const newAppointment: Appointment = {
        ...data,
        status: data.status as 'agendado' | 'concluido' | 'cancelado'
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast.success('Agendamento criado com sucesso!');
      return newAppointment;
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Erro ao criar agendamento');
      throw error;
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedAppointment: Appointment = {
        ...data,
        status: data.status as 'agendado' | 'concluido' | 'cancelado'
      };
      setAppointments(prev => prev.map(appointment =>
        appointment.id === id ? updatedAppointment : appointment
      ));
      toast.success('Status do agendamento atualizado!');
      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Erro ao atualizar agendamento');
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast.success('Agendamento removido com sucesso!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Erro ao remover agendamento');
      throw error;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    refetch: fetchAppointments
  };
};
