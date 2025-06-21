
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Gift, Users, Calendar, Trophy } from "lucide-react";

const RaffleSection = () => {
  const { raffles, participateInRaffle } = useApp();
  const [selectedRaffle, setSelectedRaffle] = useState<any>(null);
  const [participantData, setParticipantData] = useState({
    name: "",
    phone: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeRaffles = raffles.filter(raffle => 
    raffle.status === 'ativo' && 
    new Date() >= new Date(raffle.startDate) &&
    new Date() <= new Date(raffle.endDate) &&
    raffle.participants.length < raffle.maxParticipants
  );

  const handleParticipate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participantData.name || !participantData.phone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!selectedRaffle) return;

    const success = participateInRaffle(selectedRaffle.id, participantData.name, participantData.phone);
    
    if (success) {
      toast.success("Participação confirmada! Boa sorte!");
      setParticipantData({ name: "", phone: "" });
      setSelectedRaffle(null);
      setIsDialogOpen(false);
    } else {
      toast.error("Não foi possível participar. Verifique se você já está participando ou se o sorteio ainda está ativo.");
    }
  };

  const openParticipationDialog = (raffle: any) => {
    setSelectedRaffle(raffle);
    setIsDialogOpen(true);
  };

  if (activeRaffles.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Gift className="h-10 w-10 text-amber-500" />
            Sorteios Ativos
          </h3>
          <p className="text-secondary-foreground text-lg">Participe e concorra a prêmios incríveis!</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRaffles.map((raffle, index) => (
            <Card key={raffle.id} className="bg-card border-amber-500/20 hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-card-foreground">{raffle.title}</CardTitle>
                <CardDescription className="text-secondary-foreground">
                  {raffle.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge className="bg-amber-500 text-black font-bold text-lg px-4 py-2">
                    <Trophy className="h-4 w-4 mr-2" />
                    {raffle.prize}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participantes:
                    </span>
                    <span>{raffle.participants.length}/{raffle.maxParticipants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Termina em:
                    </span>
                    <span>{format(new Date(raffle.endDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                  onClick={() => openParticipationDialog(raffle)}
                >
                  Participar do Sorteio
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 border-amber-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Participar do Sorteio</DialogTitle>
              <DialogDescription className="text-gray-300">
                Preencha seus dados para participar de: {selectedRaffle?.title}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleParticipate} className="space-y-4">
              <div>
                <Label htmlFor="participant-name" className="text-white">Nome Completo</Label>
                <Input
                  id="participant-name"
                  value={participantData.name}
                  onChange={(e) => setParticipantData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-amber-500/30 text-white"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="participant-phone" className="text-white">Telefone</Label>
                <Input
                  id="participant-phone"
                  value={participantData.phone}
                  onChange={(e) => setParticipantData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-700 border-amber-500/30 text-white"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                Confirmar Participação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default RaffleSection;
