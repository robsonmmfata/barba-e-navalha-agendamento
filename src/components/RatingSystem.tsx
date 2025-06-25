
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Star, MessageSquare } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Rating {
  id: string;
  appointmentId: string;
  barberId: string;
  clientId: string;
  rating: number;
  comment: string;
  date: string;
}

const RatingSystem = () => {
  const { appointments, barbers } = useApp();
  const { user } = useAuth();
  const [ratings, setRatings] = useLocalStorage<Rating[]>('barbershop-ratings', []);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const userCompletedAppointments = appointments.filter(apt => 
    apt.client_id === user?.id && 
    apt.status === 'concluido' &&
    !ratings.some(rating => rating.appointmentId === apt.id)
  );

  const submitRating = () => {
    if (!selectedAppointment || selectedRating === 0) {
      toast.error("Por favor, selecione uma avaliação");
      return;
    }

    const newRating: Rating = {
      id: Date.now().toString(),
      appointmentId: selectedAppointment.id,
      barberId: selectedAppointment.barber_id,
      clientId: user?.id || '',
      rating: selectedRating,
      comment,
      date: new Date().toISOString()
    };

    setRatings(prev => [...prev, newRating]);
    toast.success("Avaliação enviada com sucesso!");
    
    setSelectedRating(0);
    setComment("");
    setSelectedAppointment(null);
    setIsDialogOpen(false);
  };

  const getBarberAverageRating = (barberId: string) => {
    const barberRatings = ratings.filter(rating => rating.barberId === barberId);
    if (barberRatings.length === 0) return 0;
    
    const total = barberRatings.reduce((sum, rating) => sum + rating.rating, 0);
    return total / barberRatings.length;
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Pending Reviews */}
      {userCompletedAppointments.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Avaliar Atendimentos
            </CardTitle>
            <CardDescription>
              Você tem {userCompletedAppointments.length} atendimento(s) para avaliar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userCompletedAppointments.map(appointment => {
                const barber = barbers.find(b => b.id === appointment.barber_id);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{barber?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                      </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          Avaliar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Avaliar Atendimento</DialogTitle>
                          <DialogDescription>
                            Como foi seu atendimento com {barber?.name}?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Sua avaliação:</label>
                            <div className="mt-2">
                              {renderStars(selectedRating, true, setSelectedRating)}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Comentário (opcional):</label>
                            <Textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Conte como foi sua experiência..."
                              className="mt-1"
                            />
                          </div>
                          <Button onClick={submitRating} className="w-full">
                            Enviar Avaliação
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barber Ratings */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Avaliações dos Barbeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {barbers.map(barber => {
              const averageRating = getBarberAverageRating(barber.id);
              const barberRatings = ratings.filter(rating => rating.barberId === barber.id);
              
              return (
                <div key={barber.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{barber.name}</h4>
                      <p className="text-sm text-gray-600">{barber.specialty}</p>
                    </div>
                    <div className="text-right">
                      {renderStars(Math.round(averageRating))}
                      <p className="text-sm text-gray-600 mt-1">
                        {averageRating.toFixed(1)} ({barberRatings.length} avaliações)
                      </p>
                    </div>
                  </div>
                  
                  {barberRatings.length > 0 && (
                    <div className="space-y-2 mt-3 pt-3 border-t">
                      <h5 className="text-sm font-medium">Últimas avaliações:</h5>
                      {barberRatings.slice(-3).map(rating => (
                        <div key={rating.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            {renderStars(rating.rating)}
                            <Badge variant="outline" className="text-xs">
                              {new Date(rating.date).toLocaleDateString('pt-BR')}
                            </Badge>
                          </div>
                          {rating.comment && (
                            <p className="text-gray-600 mt-1 italic">"{rating.comment}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingSystem;
