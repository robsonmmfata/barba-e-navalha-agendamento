import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  experience: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  participants: string[];
  status: 'ativo' | 'encerrado' | 'sorteado';
  winner?: string;
}

interface AppContextType {
  services: Service[];
  barbers: Barber[];
  clients: Client[];
  appointments: Appointment[];
  raffles: Raffle[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addBarber: (barber: Omit<Barber, 'id'>) => void;
  updateBarber: (id: string, barber: Partial<Barber>) => void;
  deleteBarber: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  addRaffle: (raffle: Omit<Raffle, 'id' | 'participants' | 'status'>) => void;
  updateRaffle: (id: string, raffle: Partial<Raffle>) => void;
  deleteRaffle: (id: string) => void;
  participateInRaffle: (raffleId: string, participantName: string, participantPhone: string) => boolean;
  drawRaffleWinner: (raffleId: string) => string | null;
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
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Corte Tradicional', price: 25, duration: 30 },
    { id: '2', name: 'Corte + Barba', price: 35, duration: 45 },
    { id: '3', name: 'Barba Completa', price: 20, duration: 30 },
    { id: '4', name: 'Corte Premium', price: 45, duration: 60 },
  ]);

  const [barbers, setBarbers] = useState<Barber[]>([
    { id: '1', name: 'João Silva', specialty: 'Cortes Clássicos', experience: '8 anos' },
    { id: '2', name: 'Pedro Santos', specialty: 'Barbas e Bigodes', experience: '5 anos' },
    { id: '3', name: 'Carlos Oliveira', specialty: 'Cortes Modernos', experience: '10 anos' },
  ]);

  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('barbershop-clients');
    const savedAppointments = localStorage.getItem('barbershop-appointments');
    const savedServices = localStorage.getItem('barbershop-services');
    const savedBarbers = localStorage.getItem('barbershop-barbers');
    const savedRaffles = localStorage.getItem('barbershop-raffles');

    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
    if (savedBarbers) {
      setBarbers(JSON.parse(savedBarbers));
    }
    if (savedRaffles) {
      setRaffles(JSON.parse(savedRaffles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('barbershop-clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('barbershop-appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('barbershop-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('barbershop-barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('barbershop-raffles', JSON.stringify(raffles));
  }, [raffles]);

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updatedService: Partial<Service>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    ));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const addBarber = (barber: Omit<Barber, 'id'>) => {
    const newBarber = { ...barber, id: Date.now().toString() };
    setBarbers(prev => [...prev, newBarber]);
  };

  const updateBarber = (id: string, updatedBarber: Partial<Barber>) => {
    setBarbers(prev => prev.map(barber => 
      barber.id === id ? { ...barber, ...updatedBarber } : barber
    ));
  };

  const deleteBarber = (id: string) => {
    setBarbers(prev => prev.filter(barber => barber.id !== id));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: Date.now().toString() };
    setClients(prev => [...prev, newClient]);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: Date.now().toString() };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(appointment =>
      appointment.id === id ? { ...appointment, status } : appointment
    ));
  };

  const addRaffle = (raffle: Omit<Raffle, 'id' | 'participants' | 'status'>) => {
    const newRaffle = { 
      ...raffle, 
      id: Date.now().toString(),
      participants: [],
      status: 'ativo' as const
    };
    setRaffles(prev => [...prev, newRaffle]);
  };

  const updateRaffle = (id: string, updatedRaffle: Partial<Raffle>) => {
    setRaffles(prev => prev.map(raffle => 
      raffle.id === id ? { ...raffle, ...updatedRaffle } : raffle
    ));
  };

  const deleteRaffle = (id: string) => {
    setRaffles(prev => prev.filter(raffle => raffle.id !== id));
  };

  const participateInRaffle = (raffleId: string, participantName: string, participantPhone: string) => {
    const raffle = raffles.find(r => r.id === raffleId);
    if (!raffle || raffle.status !== 'ativo') return false;
    if (raffle.participants.length >= raffle.maxParticipants) return false;
    if (new Date() > new Date(raffle.endDate)) return false;

    const participantKey = `${participantName}-${participantPhone}`;
    if (raffle.participants.includes(participantKey)) return false;

    updateRaffle(raffleId, {
      participants: [...raffle.participants, participantKey]
    });

    return true;
  };

  const drawRaffleWinner = (raffleId: string) => {
    const raffle = raffles.find(r => r.id === raffleId);
    if (!raffle || raffle.participants.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * raffle.participants.length);
    const winner = raffle.participants[randomIndex];

    updateRaffle(raffleId, {
      winner,
      status: 'sorteado'
    });

    return winner;
  };

  return (
    <AppContext.Provider value={{
      services,
      barbers,
      clients,
      appointments,
      raffles,
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
