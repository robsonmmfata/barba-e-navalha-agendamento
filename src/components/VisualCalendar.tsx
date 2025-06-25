
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

const VisualCalendar = () => {
  const { appointments, barbers, services } = useApp();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const getAppointmentForSlot = (date: Date, time: string) => {
    return appointments.find(apt => 
      isSameDay(parseISO(apt.date), date) && apt.time === time
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-500';
      case 'concluido': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Agenda Visual
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(weekStart, "dd/MM", { locale: ptBR })} - {format(addDays(weekStart, 6), "dd/MM", { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-2 text-sm font-medium text-gray-600">Horário</div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className="p-2 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {format(day, "EEEE", { locale: ptBR })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {format(day, "dd/MM", { locale: ptBR })}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-8 gap-1 mb-1">
                <div className="p-2 text-xs text-gray-600 font-medium border-r">
                  {time}
                </div>
                {weekDays.map(day => {
                  const appointment = getAppointmentForSlot(day, time);
                  const barber = appointment ? barbers.find(b => b.id === appointment.barber_id) : null;
                  const service = appointment ? services.find(s => s.id === appointment.service_id) : null;

                  return (
                    <div key={`${day.toISOString()}-${time}`} className="min-h-[60px] border border-gray-200 rounded p-1">
                      {appointment && (
                        <div className={`p-2 rounded text-white text-xs ${getStatusColor(appointment.status)}`}>
                          <div className="font-medium truncate">{service?.name}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{barber?.name}</span>
                          </div>
                          <Badge className="mt-1 text-[10px] bg-white/20">
                            {appointment.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs">Cancelado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualCalendar;
