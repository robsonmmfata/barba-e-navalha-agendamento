
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Scissors, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const Agendamento = () => {
  const { services, barbers, addClient, addAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
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

    // Add client
    addClient(clientData);
    
    // Add appointment
    addAppointment({
      clientId: Date.now().toString(),
      barberId: selectedBarber,
      serviceId: selectedService,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      status: "agendado"
    });

    toast.success("Agendamento realizado com sucesso!", {
      description: `${clientData.name}, seu horário foi confirmado para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às ${selectedTime}.`
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedService("");
    setSelectedBarber("");
    setClientData({ name: "", phone: "", email: "" });
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedBarberData = barbers.find(b => b.id === selectedBarber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-barbershop-dark via-barbershop-dark-light to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-dark">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-barbershop-gold" />
              <h1 className="text-3xl font-bold text-white">Agendamento Online</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-barbershop-dark-light border-barbershop-gold/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Faça seu Agendamento</CardTitle>
              <CardDescription className="text-gray-400">
                Preencha os dados abaixo para agendar seu horário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-barbershop-gold">Dados Pessoais</h3>
                  
                  <div>
                    <Label htmlFor="name" className="text-white">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={clientData.name}
                      onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-barbershop-dark border-barbershop-gold/30 text-white placeholder:text-gray-400"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Telefone *</Label>
                    <Input
                      id="phone"
                      value={clientData.phone}
                      onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-barbershop-dark border-barbershop-gold/30 text-white placeholder:text-gray-400"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientData.email}
                      onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-barbershop-dark border-barbershop-gold/30 text-white placeholder:text-gray-400"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-barbershop-gold">Serviço e Profissional</h3>
                  
                  <div>
                    <Label className="text-white">Serviço *</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="bg-barbershop-dark border-barbershop-gold/30 text-white">
                        <SelectValue placeholder="Escolha um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-barbershop-dark border-barbershop-gold/30">
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="text-white hover:bg-barbershop-gold/20">
                            {service.name} - R$ {service.price} ({service.duration}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Barbeiro *</Label>
                    <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                      <SelectTrigger className="bg-barbershop-dark border-barbershop-gold/30 text-white">
                        <SelectValue placeholder="Escolha um barbeiro" />
                      </SelectTrigger>
                      <SelectContent className="bg-barbershop-dark border-barbershop-gold/30">
                        {barbers.map((barber) => (
                          <SelectItem key={barber.id} value={barber.id} className="text-white hover:bg-barbershop-gold/20">
                            {barber.name} - {barber.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-barbershop-gold">Data e Horário</h3>
                  
                  <div>
                    <Label className="text-white">Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-barbershop-dark border-barbershop-gold/30 text-white hover:bg-barbershop-gold/10",
                            !selectedDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-barbershop-dark border-barbershop-gold/30" align="start">
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
                    <Label className="text-white">Horário *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="bg-barbershop-dark border-barbershop-gold/30 text-white">
                        <SelectValue placeholder="Escolha um horário" />
                      </SelectTrigger>
                      <SelectContent className="bg-barbershop-dark border-barbershop-gold/30">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-white hover:bg-barbershop-gold/20">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-barbershop-gold hover:bg-barbershop-gold/80 text-barbershop-dark font-bold text-lg py-6"
                >
                  Confirmar Agendamento
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-barbershop-dark-light border-barbershop-gold/20 h-fit">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServiceData && (
                <div className="border-b border-barbershop-gold/20 pb-4">
                  <h4 className="text-barbershop-gold font-semibold mb-2">Serviço</h4>
                  <p className="text-white">{selectedServiceData.name}</p>
                  <p className="text-gray-400">R$ {selectedServiceData.price} • {selectedServiceData.duration} minutos</p>
                </div>
              )}

              {selectedBarberData && (
                <div className="border-b border-barbershop-gold/20 pb-4">
                  <h4 className="text-barbershop-gold font-semibold mb-2">Profissional</h4>
                  <p className="text-white">{selectedBarberData.name}</p>
                  <p className="text-gray-400">{selectedBarberData.specialty}</p>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="border-b border-barbershop-gold/20 pb-4">
                  <h4 className="text-barbershop-gold font-semibold mb-2">Data e Horário</h4>
                  <p className="text-white">{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  <p className="text-gray-400">{selectedTime}</p>
                </div>
              )}

              {clientData.name && (
                <div>
                  <h4 className="text-barbershop-gold font-semibold mb-2">Cliente</h4>
                  <p className="text-white">{clientData.name}</p>
                  <p className="text-gray-400">{clientData.phone}</p>
                </div>
              )}

              {selectedServiceData && (
                <div className="pt-4 border-t border-barbershop-gold/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-barbershop-gold">R$ {selectedServiceData.price}</span>
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
