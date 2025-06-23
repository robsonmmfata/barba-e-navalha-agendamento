
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { Bell, MessageSquare, Phone } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface NotificationSettings {
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  reminderHours: number;
}

const NotificationSystem = () => {
  const { appointments } = useApp();
  const [settings, setSettings] = useLocalStorage<NotificationSettings>('notification-settings', {
    whatsappEnabled: false,
    smsEnabled: false,
    emailEnabled: true,
    reminderHours: 24
  });
  const [whatsappWebhook, setWhatsappWebhook] = useLocalStorage('whatsapp-webhook', '');

  const sendNotification = async (type: 'whatsapp' | 'sms' | 'email', message: string) => {
    if (type === 'whatsapp' && whatsappWebhook) {
      try {
        await fetch(whatsappWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify({ message, timestamp: new Date().toISOString() })
        });
        toast.success("Notificação WhatsApp enviada!");
      } catch (error) {
        toast.error("Erro ao enviar WhatsApp");
      }
    } else {
      toast.success(`Notificação ${type} simulada: ${message}`);
    }
  };

  const checkReminders = () => {
    const now = new Date();
    const reminderTime = settings.reminderHours * 60 * 60 * 1000;
    
    appointments
      .filter(apt => apt.status === 'agendado')
      .forEach(apt => {
        const appointmentTime = new Date(`${apt.date} ${apt.time}`);
        const timeDiff = appointmentTime.getTime() - now.getTime();
        
        if (timeDiff > 0 && timeDiff <= reminderTime) {
          const message = `Lembrete: Você tem um agendamento hoje às ${apt.time}`;
          if (settings.whatsappEnabled) sendNotification('whatsapp', message);
          if (settings.smsEnabled) sendNotification('sms', message);
          if (settings.emailEnabled) sendNotification('email', message);
        }
      });
  };

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [appointments, settings]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Sistema de Notificações
        </CardTitle>
        <CardDescription>
          Configure lembretes automáticos para os clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <Label>WhatsApp</Label>
            </div>
            <Switch
              checked={settings.whatsappEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, whatsappEnabled: checked }))
              }
            />
          </div>
          
          {settings.whatsappEnabled && (
            <div>
              <Label>Webhook do WhatsApp (Zapier)</Label>
              <Input
                value={whatsappWebhook}
                onChange={(e) => setWhatsappWebhook(e.target.value)}
                placeholder="Cole sua URL do webhook do Zapier aqui"
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              <Label>SMS</Label>
            </div>
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, smsEnabled: checked }))
              }
            />
          </div>

          <div>
            <Label>Lembrar com antecedência (horas)</Label>
            <Input
              type="number"
              value={settings.reminderHours}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, reminderHours: parseInt(e.target.value) || 24 }))
              }
              className="mt-1 w-24"
              min="1"
              max="168"
            />
          </div>
        </div>

        <Button 
          onClick={() => sendNotification('whatsapp', 'Teste de notificação!')}
          className="w-full"
          disabled={!settings.whatsappEnabled || !whatsappWebhook}
        >
          Testar Notificação
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
