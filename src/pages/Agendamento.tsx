
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Scissors, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const Agendamento = () => {
  const { services, barbers, addClient, addAppointment } = useApp();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [clientData, setClientData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService || !selectedBarber || !clientData.name || !clientData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Add client if not authenticated
    if (!isAuthenticated) {
      addClient(clientData);
    }
    
    // Add appointment
    addAppointment({
      clientId: user?.id || Date.now().toString(),
      barberId: selectedBarber,
      serviceId: selectedService,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      status: "agendado"
    });

    toast.success("Agendamento realizado com sucesso!", {
      description: `${clientData.name}, seu horário foi confirmado para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às ${selectedTime}.`
    });

    // Redirect based on authentication
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Reset form for non-authenticated users
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedService("");
      setSelectedBarber("");
      setClientData({ name: "", phone: "", email: "" });
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedBarberData = barbers.find(b => b.id === selectedBarber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-800">Agendamento Online</h1>
            </div>
          </div>
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Fazer Login
              </Button>
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-gray-800 text-2xl">Faça seu Agendamento</CardTitle>
              <CardDescription className="text-gray-600">
                Preencha os dados abaixo para agendar seu horário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Data */}
                {!isAuthenticated && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Dados Pessoais</h3>
                    
                    <div>
                      <Label htmlFor="name" className="text-gray-700">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={clientData.name}
                        onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/70 border-gray-300 focus:border-primary"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700">Telefone *</Label>
                      <Input
                        id="phone"
                        value={clientData.phone}
                        onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-white/70 border-gray-300 focus:border-primary"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientData.email}
                        onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/70 border-gray-300 focus:border-primary"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                )}

                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Serviço e Profissional</h3>
                  
                  <div>
                    <Label className="text-gray-700">Serviço *</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="bg-white/70 border-gray-300 focus:border-primary">
                        <SelectValue placeholder="Escolha um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {service.price} ({service.duration}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-700">Barbeiro *</Label>
                    <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                      <SelectTrigger className="bg-white/70 border-gray-300 focus:border-primary">
                        <SelectValue placeholder="Escolha um barbeiro" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {barbers.map((barber) => (
                          <SelectItem key={barber.id} value={barber.id}>
                            {barber.name} - {barber.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Data e Horário</h3>
                  
                  <div>
                    <Label className="text-gray-700">Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/70 border-gray-300 hover:bg-white/90",
                            !selectedDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-gray-700">Horário *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="bg-white/70 border-gray-300 focus:border-primary">
                        <SelectValue placeholder="Escolha um horário" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6"
                >
                  Confirmar Agendamento
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 h-fit">
            <CardHeader>
              <CardTitle className="text-gray-800 text-2xl">Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServiceData && (
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-primary font-semibold mb-2">Serviço</h4>
                  <p className="text-gray-800">{selectedServiceData.name}</p>
                  <p className="text-gray-600">R$ {selectedServiceData.price} • {selectedServiceData.duration} minutos</p>
                </div>
              )}

              {selectedBarberData && (
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-primary font-semibold mb-2">Profissional</h4>
                  <p className="text-gray-800">{selectedBarberData.name}</p>
                  <p className="text-gray-600">{selectedBarberData.specialty}</p>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-primary font-semibold mb-2">Data e Horário</h4>
                  <p className="text-gray-800">{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  <p className="text-gray-600">{selectedTime}</p>
                </div>
              )}

              {(clientData.name || user?.name) && (
                <div>
                  <h4 className="text-primary font-semibold mb-2">Cliente</h4>
                  <p className="text-gray-800">{clientData.name || user?.name}</p>
                  <p className="text-gray-600">{clientData.phone || user?.phone}</p>
                </div>
              )}

              {selectedServiceData && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-primary">R$ {selectedServiceData.price}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;
