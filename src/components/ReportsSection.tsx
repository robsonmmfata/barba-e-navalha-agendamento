
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react";

const ReportsSection = () => {
  const { appointments, services, barbers } = useApp();

  // Revenue calculations
  const completedAppointments = appointments.filter(apt => apt.status === 'concluido');
  const totalRevenue = completedAppointments.reduce((total, apt) => {
    const service = services.find(s => s.id === apt.service_id);
    return total + (service?.price || 0);
  }, 0);

  // Monthly revenue data
  const monthlyData = completedAppointments.reduce((acc, apt) => {
    const month = new Date(apt.date).getMonth();
    const monthName = new Date(0, month).toLocaleDateString('pt-BR', { month: 'long' });
    const service = services.find(s => s.id === apt.service_id);
    const revenue = service?.price || 0;

    const existing = acc.find(item => item.month === monthName);
    if (existing) {
      existing.revenue += revenue;
      existing.appointments += 1;
    } else {
      acc.push({ month: monthName, revenue, appointments: 1 });
    }
    return acc;
  }, [] as { month: string; revenue: number; appointments: number }[]);

  // Barber performance
  const barberData = barbers.map(barber => {
    const barberAppointments = completedAppointments.filter(apt => apt.barber_id === barber.id);
    const revenue = barberAppointments.reduce((total, apt) => {
      const service = services.find(s => s.id === apt.service_id);
      return total + (service?.price || 0);
    }, 0);
    
    return {
      name: barber.name,
      appointments: barberAppointments.length,
      revenue
    };
  });

  // Service popularity
  const serviceData = services.map(service => {
    const serviceAppointments = completedAppointments.filter(apt => apt.service_id === service.id);
    return {
      name: service.name,
      count: serviceAppointments.length,
      revenue: serviceAppointments.length * service.price
    };
  });

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faturamento Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendamentos</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{completedAppointments.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Sucesso</p>
                <p className="text-2xl font-bold text-purple-600">
                  {appointments.length > 0 ? Math.round((completedAppointments.length / appointments.length) * 100) : 0}%
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle>Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                <Bar dataKey="revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle>Popularidade dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Performance dos Barbeiros</CardTitle>
          <CardDescription>Ranking por número de atendimentos e faturamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {barberData
              .sort((a, b) => b.revenue - a.revenue)
              .map((barber, index) => (
                <div key={barber.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge className={`${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'} text-white`}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-semibold">{barber.name}</p>
                      <p className="text-sm text-gray-600">{barber.appointments} atendimentos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {barber.revenue}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
