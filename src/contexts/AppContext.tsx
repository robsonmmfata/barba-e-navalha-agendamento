
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

interface AppContextType {
  services: Service[];
  barbers: Barber[];
  clients: Client[];
  appointments: Appointment[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addBarber: (barber: Omit<Barber, 'id'>) => void;
  updateBarber: (id: string, barber: Partial<Barber>) => void;
  deleteBarber: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
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

  useEffect(() => {
    const savedClients = localStorage.getItem('barbershop-clients');
    const savedAppointments = localStorage.getItem('barbershop-appointments');
    const savedServices = localStorage.getItem('barbershop-services');
    const savedBarbers = localStorage.getItem('barbershop-barbers');

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

  return (
    <AppContext.Provider value={{
      services,
      barbers,
      clients,
      appointments,
      addService,
      updateService,
      deleteService,
      addBarber,
      updateBarber,
      deleteBarber,
      addClient,
      addAppointment,
      updateAppointmentStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};
