
import React, { createContext, useContext } from 'react';
import { useServices, Service } from '@/hooks/useServices';
import { useBarbers, Barber } from '@/hooks/useBarbers';
import { useClients, Client } from '@/hooks/useClients';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { useRaffles, Raffle } from '@/hooks/useRaffles';

// Re-export types for compatibility
export type { Service, Barber, Client, Appointment, Raffle };

interface AppContextType {
  services: Service[];
  barbers: Barber[];
  clients: Client[];
  appointments: Appointment[];
  raffles: Raffle[];
  loading: {
    services: boolean;
    barbers: boolean;
    clients: boolean;
    appointments: boolean;
    raffles: boolean;
  };
  addService: (service: Omit<Service, 'id'>) => Promise<Service>;
  updateService: (id: string, service: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  addBarber: (barber: Omit<Barber, 'id'>) => Promise<Barber>;
  updateBarber: (id: string, barber: Partial<Barber>) => Promise<Barber>;
  deleteBarber: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, 'id'>) => Promise<Client>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<Appointment>;
  addRaffle: (raffle: Omit<Raffle, 'id' | 'participants' | 'status'>) => Promise<Raffle>;
  updateRaffle: (id: string, raffle: Partial<Raffle>) => Promise<Raffle>;
  deleteRaffle: (id: string) => Promise<void>;
  participateInRaffle: (raffleId: string, participantName: string, participantPhone: string) => Promise<boolean>;
  drawRaffleWinner: (raffleId: string) => Promise<string | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    services,
    loading: servicesLoading,
    addService,
    updateService,
    deleteService
  } = useServices();

  const {
    barbers,
    loading: barbersLoading,
    addBarber,
    updateBarber,
    deleteBarber
  } = useBarbers();

  const {
    clients,
    loading: clientsLoading,
    addClient
  } = useClients();

  const {
    appointments,
    loading: appointmentsLoading,
    addAppointment,
    updateAppointmentStatus
  } = useAppointments();

  const {
    raffles,
    loading: rafflesLoading,
    addRaffle,
    updateRaffle,
    deleteRaffle,
    participateInRaffle,
    drawRaffleWinner
  } = useRaffles();

  return (
    <AppContext.Provider value={{
      services,
      barbers,
      clients,
      appointments,
      raffles,
      loading: {
        services: servicesLoading,
        barbers: barbersLoading,
        clients: clientsLoading,
        appointments: appointmentsLoading,
        raffles: rafflesLoading
      },
      addService,
      updateService,
      deleteService,
      addBarber,
      updateBarber,
      deleteBarber,
      addClient,
      addAppointment,
      updateAppointmentStatus,
      addRaffle,
      updateRaffle,
      deleteRaffle,
      participateInRaffle,
      drawRaffleWinner,
    }}>
      {children}
    </AppContext.Provider>
  );
};
