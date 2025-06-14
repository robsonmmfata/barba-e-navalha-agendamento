import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Scissors, ArrowLeft, Plus, Edit, Trash2, Users, Calendar, DollarSign, User } from "lucide-react";

const Admin = () => {
  const { 
    services, 
    clients, 
    appointments, 
    barbers,
    addService, 
    updateService, 
    deleteService,
    addBarber,
    updateBarber,
    deleteBarber,
    updateAppointmentStatus 
  } = useApp();

  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const [isAddBarberOpen, setIsAddBarberOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<any>(null);
  const [newBarber, setNewBarber] = useState({
    name: "",
    specialty: "",
    experience: "",
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newService.name || !newService.price || !newService.duration) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    addService({
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration),
    });

    toast.success("Serviço adicionado com sucesso!");
    setNewService({ name: "", price: "", duration: "" });
    setIsAddServiceOpen(false);
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingService || !editingService.name || !editingService.price || !editingService.duration) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    updateService(editingService.id, {
      name: editingService.name,
      price: Number(editingService.price),
      duration: Number(editingService.duration),
    });

    toast.success("Serviço atualizado com sucesso!");
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    deleteService(id);
    toast.success("Serviço removido com sucesso!");
  };

  const handleAddBarber = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBarber.name || !newBarber.specialty || !newBarber.experience) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    addBarber({
      name: newBarber.name,
      specialty: newBarber.specialty,
      experience: newBarber.experience,
    });

    toast.success("Barbeiro adicionado com sucesso!");
    setNewBarber({ name: "", specialty: "", experience: "" });
    setIsAddBarberOpen(false);
  };

  const handleUpdateBarber = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBarber || !editingBarber.name || !editingBarber.specialty || !editingBarber.experience) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    updateBarber(editingBarber.id, {
      name: editingBarber.name,
      specialty: editingBarber.specialty,
      experience: editingBarber.experience,
    });

    toast.success("Barbeiro atualizado com sucesso!");
    setEditingBarber(null);
  };

  const handleDeleteBarber = (id: string) => {
    deleteBarber(id);
    toast.success("Barbeiro removido com sucesso!");
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

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? barber.name : 'Barbeiro não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-amber-500" />
              <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gray-800/90 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{clients.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Barbeiros</CardTitle>
              <User className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{barbers.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Serviços</CardTitle>
              <Scissors className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{services.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Receita (Est.)</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {appointments.filter(a => a.status === 'concluido').reduce((acc, appointment) => {
                  const service = services.find(s => s.id === appointment.serviceId);
                  return acc + (service ? service.price : 0);
                }, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/90">
            <TabsTrigger value="appointments" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="barbers" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Barbeiros
            </TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Serviços
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Clientes
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="bg-gray-800/90 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">Agendamentos</CardTitle>
                <CardDescription className="text-gray-300">
                  Gerencie todos os agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-500/20">
                      <TableHead className="text-gray-300">Cliente</TableHead>
                      <TableHead className="text-gray-300">Barbeiro</TableHead>
                      <TableHead className="text-gray-300">Serviço</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Horário</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id} className="border-amber-500/20">
                        <TableCell className="text-white">{getClientName(appointment.clientId)}</TableCell>
                        <TableCell className="text-white">{getBarberName(appointment.barberId)}</TableCell>
                        <TableCell className="text-white">{getServiceName(appointment.serviceId)}</TableCell>
                        <TableCell className="text-white">
                          {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-white">{appointment.time}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={appointment.status}
                            onValueChange={(value: any) => updateAppointmentStatus(appointment.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-gray-700 border-amber-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-amber-500/30">
                              <SelectItem value="agendado" className="text-white">Agendado</SelectItem>
                              <SelectItem value="concluido" className="text-white">Concluído</SelectItem>
                              <SelectItem value="cancelado" className="text-white">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Barbers Tab */}
          <TabsContent value="barbers">
            <Card className="bg-gray-800/90 border-amber-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Barbeiros</CardTitle>
                    <CardDescription className="text-gray-300">
                      Gerencie os barbeiros da barbearia
                    </CardDescription>
                  </div>
                  <Dialog open={isAddBarberOpen} onOpenChange={setIsAddBarberOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Barbeiro
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-amber-500/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Novo Barbeiro</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Preencha os dados do novo barbeiro
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddBarber} className="space-y-4">
                        <div>
                          <Label htmlFor="barber-name" className="text-white">Nome do Barbeiro</Label>
                          <Input
                            id="barber-name"
                            value={newBarber.name}
                            onChange={(e) => setNewBarber(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-700 border-amber-500/30 text-white"
                            placeholder="Ex: João Silva"
                          />
                        </div>
                        <div>
                          <Label htmlFor="barber-specialty" className="text-white">Especialidade</Label>
                          <Input
                            id="barber-specialty"
                            value={newBarber.specialty}
                            onChange={(e) => setNewBarber(prev => ({ ...prev, specialty: e.target.value }))}
                            className="bg-gray-700 border-amber-500/30 text-white"
                            placeholder="Ex: Cortes Modernos"
                          />
                        </div>
                        <div>
                          <Label htmlFor="barber-experience" className="text-white">Experiência</Label>
                          <Input
                            id="barber-experience"
                            value={newBarber.experience}
                            onChange={(e) => setNewBarber(prev => ({ ...prev, experience: e.target.value }))}
                            className="bg-gray-700 border-amber-500/30 text-white"
                            placeholder="Ex: 5 anos"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                          Adicionar Barbeiro
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {barbers.map((barber) => (
                    <div key={barber.id} className="flex items-center justify-between p-4 border border-amber-500/20 rounded-lg">
                      <div>
                        <h3 className="text-white font-semibold">{barber.name}</h3>
                        <p className="text-gray-300">{barber.specialty} • {barber.experience}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black"
                              onClick={() => setEditingBarber(barber)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-amber-500/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">Editar Barbeiro</DialogTitle>
                            </DialogHeader>
                            {editingBarber && (
                              <form onSubmit={handleUpdateBarber} className="space-y-4">
                                <div>
                                  <Label className="text-white">Nome do Barbeiro</Label>
                                  <Input
                                    value={editingBarber.name}
                                    onChange={(e) => setEditingBarber(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-gray-700 border-amber-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Especialidade</Label>
                                  <Input
                                    value={editingBarber.specialty}
                                    onChange={(e) => setEditingBarber(prev => ({ ...prev, specialty: e.target.value }))}
                                    className="bg-gray-700 border-amber-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Experiência</Label>
                                  <Input
                                    value={editingBarber.experience}
                                    onChange={(e) => setEditingBarber(prev => ({ ...prev, experience: e.target.value }))}
                                    className="bg-gray-700 border-amber-500/30 text-white"
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                                  Salvar Alterações
                                </Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteBarber(barber.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-gray-800/90 border-amber-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Serviços</CardTitle>
                    <CardDescription className="text-gray-300">
                      Gerencie os serviços oferecidos
                    </CardDescription>
                  </div>
                  <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Serviço
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-amber-500/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Novo Serviço</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Preencha os dados do novo serviço
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddService} className="space-y-4">
                        <div>
                          <Label htmlFor="service-name" className="text-white">Nome do Serviço</Label>
                          <Input
                            id="service-name"
                            value={newService.name}
                            onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-700 border-amber-500/30 text-white"
                            placeholder="Ex: Corte Moderno"
                          />
                        </div>
                        <div>
                          <Label htmlFor="service-price" className="text-white">Preço (R$)</Label>
                          <Input
                            id="service-price"
                            type="number"
                            value={newService.price}
                            onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                            className="bg-gray-700 border-amber-500/30 text-white"
                            placeholder="30"
                          />
                        </div>
                        <div>
                          <Label htmlFor="service-duration" className="text-white">Duração (minutos)</Label>
                          <Input
                            id="service-duration"
                            type="number"
                            value={newService.duration}
                            onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                            className="bg-gray-700 border-amber-500/30 text-white"
                            placeholder="45"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                          Adicionar Serviço
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border border-amber-500/20 rounded-lg">
                      <div>
                        <h3 className="text-white font-semibold">{service.name}</h3>
                        <p className="text-gray-300">R$ {service.price} • {service.duration} minutos</p>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black"
                              onClick={() => setEditingService(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-amber-500/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">Editar Serviço</DialogTitle>
                            </DialogHeader>
                            {editingService && (
                              <form onSubmit={handleUpdateService} className="space-y-4">
                                <div>
                                  <Label className="text-white">Nome do Serviço</Label>
                                  <Input
                                    value={editingService.name}
                                    onChange={(e) => setEditingService(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-gray-700 border-amber-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Preço (R$)</Label>
                                  <Input
                                    type="number"
                                    value={editingService.price}
                                    onChange={(e) => setEditingService(prev => ({ ...prev, price: e.target.value }))}
                                    className="bg-gray-700 border-amber-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Duração (minutos)</Label>
                                  <Input
                                    type="number"
                                    value={editingService.duration}
                                    onChange={(e) => setEditingService(prev => ({ ...prev, duration: e.target.value }))}
                                    className="bg-gray-700 border-amber-500/30 text-white"
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                                  Salvar Alterações
                                </Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card className="bg-gray-800/90 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">Clientes</CardTitle>
                <CardDescription className="text-gray-300">
                  Lista de todos os clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-500/20">
                      <TableHead className="text-gray-300">Nome</TableHead>
                      <TableHead className="text-gray-300">Telefone</TableHead>
                      <TableHead className="text-gray-300">E-mail</TableHead>
                      <TableHead className="text-gray-300">Agendamentos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="border-amber-500/20">
                        <TableCell className="text-white">{client.name}</TableCell>
                        <TableCell className="text-white">{client.phone}</TableCell>
                        <TableCell className="text-white">{client.email || '-'}</TableCell>
                        <TableCell className="text-white">
                          {appointments.filter(a => a.clientId === client.id).length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
