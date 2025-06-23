
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Settings, Clock, Calendar, Download, Upload } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SystemConfig {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  holidays: string[];
  appointmentDuration: number;
  maxAdvanceBooking: number;
  cancellationPolicy: string;
}

const SystemSettings = () => {
  const [config, setConfig] = useLocalStorage<SystemConfig>('system-config', {
    businessName: 'BarberShop Premium',
    businessPhone: '(11) 99999-9999',
    businessEmail: 'contato@barbershop.com',
    businessAddress: 'Rua da Barbearia, 123 - Centro',
    openingHours: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '08:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    },
    holidays: [],
    appointmentDuration: 30,
    maxAdvanceBooking: 30,
    cancellationPolicy: 'Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.'
  });

  const [newHoliday, setNewHoliday] = useState('');

  const updateBusinessInfo = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day as keyof typeof prev.openingHours],
          [field]: value
        }
      }
    }));
  };

  const addHoliday = () => {
    if (newHoliday && !config.holidays.includes(newHoliday)) {
      setConfig(prev => ({
        ...prev,
        holidays: [...prev.holidays, newHoliday]
      }));
      setNewHoliday('');
      toast.success('Feriado adicionado!');
    }
  };

  const removeHoliday = (holiday: string) => {
    setConfig(prev => ({
      ...prev,
      holidays: prev.holidays.filter(h => h !== holiday)
    }));
    toast.success('Feriado removido!');
  };

  const exportData = () => {
    const allData = {
      config,
      appointments: JSON.parse(localStorage.getItem('barbershop-appointments') || '[]'),
      clients: JSON.parse(localStorage.getItem('barbershop-clients') || '[]'),
      services: JSON.parse(localStorage.getItem('barbershop-services') || '[]'),
      barbers: JSON.parse(localStorage.getItem('barbershop-barbers') || '[]'),
      raffles: JSON.parse(localStorage.getItem('barbershop-raffles') || '[]')
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `barbershop-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Backup realizado com sucesso!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.config) setConfig(data.config);
        if (data.appointments) localStorage.setItem('barbershop-appointments', JSON.stringify(data.appointments));
        if (data.clients) localStorage.setItem('barbershop-clients', JSON.stringify(data.clients));
        if (data.services) localStorage.setItem('barbershop-services', JSON.stringify(data.services));
        if (data.barbers) localStorage.setItem('barbershop-barbers', JSON.stringify(data.barbers));
        if (data.raffles) localStorage.setItem('barbershop-raffles', JSON.stringify(data.raffles));
        
        toast.success('Dados importados com sucesso! Recarregue a página.');
      } catch (error) {
        toast.error('Erro ao importar dados. Verifique o arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const days = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="space-y-6">
      {/* Business Info */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Informações do Negócio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome da Barbearia</Label>
              <Input
                value={config.businessName}
                onChange={(e) => updateBusinessInfo('businessName', e.target.value)}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={config.businessPhone}
                onChange={(e) => updateBusinessInfo('businessPhone', e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={config.businessEmail}
                onChange={(e) => updateBusinessInfo('businessEmail', e.target.value)}
              />
            </div>
            <div>
              <Label>Endereço</Label>
              <Input
                value={config.businessAddress}
                onChange={(e) => updateBusinessInfo('businessAddress', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Horário de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map(day => (
            <div key={day.key} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex items-center gap-2 min-w-[120px]">
                <Switch
                  checked={!config.openingHours[day.key as keyof typeof config.openingHours].closed}
                  onCheckedChange={(checked) => updateOpeningHours(day.key, 'closed', !checked)}
                />
                <Label className="text-sm">{day.label}</Label>
              </div>
              
              {!config.openingHours[day.key as keyof typeof config.openingHours].closed && (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={config.openingHours[day.key as keyof typeof config.openingHours].open}
                    onChange={(e) => updateOpeningHours(day.key, 'open', e.target.value)}
                    className="w-32"
                  />
                  <span>até</span>
                  <Input
                    type="time"
                    value={config.openingHours[day.key as keyof typeof config.openingHours].close}
                    onChange={(e) => updateOpeningHours(day.key, 'close', e.target.value)}
                    className="w-32"
                  />
                </div>
              )}
              
              {config.openingHours[day.key as keyof typeof config.openingHours].closed && (
                <span className="text-gray-500">Fechado</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Holidays */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Feriados e Datas Especiais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="date"
              value={newHoliday}
              onChange={(e) => setNewHoliday(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addHoliday}>Adicionar</Button>
          </div>
          
          <div className="space-y-2">
            {config.holidays.map(holiday => (
              <div key={holiday} className="flex items-center justify-between p-2 border rounded">
                <span>{new Date(holiday).toLocaleDateString('pt-BR')}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeHoliday(holiday)}
                >
                  Remover
                </Button>
              </div>
            ))}
            {config.holidays.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhum feriado cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Duração padrão do agendamento (minutos)</Label>
              <Input
                type="number"
                value={config.appointmentDuration}
                onChange={(e) => setConfig(prev => ({ ...prev, appointmentDuration: parseInt(e.target.value) || 30 }))}
              />
            </div>
            <div>
              <Label>Máximo de dias para agendamento antecipado</Label>
              <Input
                type="number"
                value={config.maxAdvanceBooking}
                onChange={(e) => setConfig(prev => ({ ...prev, maxAdvanceBooking: parseInt(e.target.value) || 30 }))}
              />
            </div>
          </div>
          
          <div>
            <Label>Política de Cancelamento</Label>
            <Textarea
              value={config.cancellationPolicy}
              onChange={(e) => setConfig(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
              placeholder="Descreva sua política de cancelamento..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup/Restore */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Backup e Restauração</CardTitle>
          <CardDescription>
            Faça backup dos seus dados ou restaure de um backup anterior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={exportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Fazer Backup
            </Button>
            
            <div className="relative">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Restaurar Backup
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            O backup inclui todos os dados: agendamentos, clientes, serviços, barbeiros e sorteios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
