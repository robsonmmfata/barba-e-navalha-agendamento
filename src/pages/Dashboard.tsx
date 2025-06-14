
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Calendar, Clock, User, Scissors, LogOut, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { appointments, barbers, services } = useApp();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const userAppointments = appointments.filter(apt => {
    // Find client by matching user data
    return apt.clientId === user.id || apt.clientId === user.name;
  });

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-500';
      case 'concluido':
        return 'bg-green-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Bem-vindo,</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <User className="h-5 w-5" />
                <span>Meu Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-mail</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-semibold text-gray-800">{user.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-600">
                O que você gostaria de fazer?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/agendamento">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  <Scissors className="h-4 w-4 mr-2" />
                  Ver Serviços
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Agendamentos</span>
                <Badge className="bg-primary text-white">{userAppointments.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Agendamentos Ativos</span>
                <Badge className="bg-blue-500 text-white">
                  {userAppointments.filter(apt => apt.status === 'agendado').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Serviços Concluídos</span>
                <Badge className="bg-green-500 text-white">
                  {userAppointments.filter(apt => apt.status === 'concluido').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Meus Agendamentos</CardTitle>
            <CardDescription className="text-gray-600">
              Histórico e agendamentos futuros
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Você ainda não tem agendamentos</p>
                <Link to="/agendamento">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Fazer Primeiro Agendamento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userAppointments.map((appointment) => {
                  const barber = barbers.find(b => b.id === appointment.barberId);
                  const service = services.find(s => s.id === appointment.serviceId);
                  
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-gray-800">
                              {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                            <Clock className="h-4 w-4 text-primary ml-4" />
                            <span className="text-gray-600">{appointment.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-gray-600">Serviço</p>
                              <p className="font-semibold text-gray-800">{service?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Barbeiro</p>
                              <p className="font-semibold text-gray-800">{barber?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Valor</p>
                              <p className="font-semibold text-gray-800">R$ {service?.price}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
