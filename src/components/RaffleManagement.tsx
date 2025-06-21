
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Edit, Trash2, Gift, Users, Trophy } from "lucide-react";

const RaffleManagement = () => {
  const { 
    raffles,
    addRaffle,
    updateRaffle,
    deleteRaffle,
    drawRaffleWinner
  } = useApp();

  const [isAddRaffleOpen, setIsAddRaffleOpen] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<any>(null);
  const [newRaffle, setNewRaffle] = useState({
    title: "",
    description: "",
    prize: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
  });

  const handleAddRaffle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRaffle.title || !newRaffle.prize || !newRaffle.startDate || !newRaffle.endDate || !newRaffle.maxParticipants) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    addRaffle({
      title: newRaffle.title,
      description: newRaffle.description,
      prize: newRaffle.prize,
      startDate: newRaffle.startDate,
      endDate: newRaffle.endDate,
      maxParticipants: Number(newRaffle.maxParticipants),
    });

    toast.success("Sorteio criado com sucesso!");
    setNewRaffle({ title: "", description: "", prize: "", startDate: "", endDate: "", maxParticipants: "" });
    setIsAddRaffleOpen(false);
  };

  const handleUpdateRaffle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRaffle || !editingRaffle.title || !editingRaffle.prize) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    updateRaffle(editingRaffle.id, {
      title: editingRaffle.title,
      description: editingRaffle.description,
      prize: editingRaffle.prize,
      startDate: editingRaffle.startDate,
      endDate: editingRaffle.endDate,
      maxParticipants: Number(editingRaffle.maxParticipants),
    });

    toast.success("Sorteio atualizado com sucesso!");
    setEditingRaffle(null);
  };

  const handleDeleteRaffle = (id: string) => {
    deleteRaffle(id);
    toast.success("Sorteio removido com sucesso!");
  };

  const handleDrawWinner = (raffleId: string) => {
    const winner = drawRaffleWinner(raffleId);
    if (winner) {
      toast.success(`Ganhador sorteado: ${winner.split('-')[0]}`);
    } else {
      toast.error("Não foi possível sortear um ganhador");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500';
      case 'encerrado':
        return 'bg-gray-500';
      case 'sorteado':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-gray-800/90 border-amber-500/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Sorteios
            </CardTitle>
            <CardDescription className="text-gray-300">
              Gerencie os sorteios da barbearia
            </CardDescription>
          </div>
          <Dialog open={isAddRaffleOpen} onOpenChange={setIsAddRaffleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Novo Sorteio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-amber-500/20">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Sorteio</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Preencha os dados do novo sorteio
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRaffle} className="space-y-4">
                <div>
                  <Label htmlFor="raffle-title" className="text-white">Título do Sorteio</Label>
                  <Input
                    id="raffle-title"
                    value={newRaffle.title}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="Ex: Sorteio Corte Grátis"
                  />
                </div>
                <div>
                  <Label htmlFor="raffle-description" className="text-white">Descrição</Label>
                  <Textarea
                    id="raffle-description"
                    value={newRaffle.description}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="Descreva o sorteio..."
                  />
                </div>
                <div>
                  <Label htmlFor="raffle-prize" className="text-white">Prêmio</Label>
                  <Input
                    id="raffle-prize"
                    value={newRaffle.prize}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, prize: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="Ex: Corte + Barba Grátis"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="raffle-start" className="text-white">Data de Início</Label>
                    <Input
                      id="raffle-start"
                      type="datetime-local"
                      value={newRaffle.startDate}
                      onChange={(e) => setNewRaffle(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-gray-700 border-amber-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="raffle-end" className="text-white">Data de Fim</Label>
                    <Input
                      id="raffle-end"
                      type="datetime-local"
                      value={newRaffle.endDate}
                      onChange={(e) => setNewRaffle(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-gray-700 border-amber-500/30 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="raffle-max" className="text-white">Máximo de Participantes</Label>
                  <Input
                    id="raffle-max"
                    type="number"
                    value={newRaffle.maxParticipants}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="100"
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                  Criar Sorteio
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {raffles.map((raffle) => (
            <div key={raffle.id} className="p-4 border border-amber-500/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{raffle.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{raffle.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {raffle.prize}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {raffle.participants.length}/{raffle.maxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getStatusColor(raffle.status)} text-white`}>
                      {raffle.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {format(new Date(raffle.startDate), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(raffle.endDate), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  {raffle.winner && (
                    <p className="text-amber-500 text-sm mt-2">
                      🏆 Ganhador: {raffle.winner.split('-')[0]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {raffle.status === 'ativo' && raffle.participants.length > 0 && (
                    <Button 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleDrawWinner(raffle.id)}
                    >
                      <Trophy className="h-4 w-4 mr-1" />
                      Sortear
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black"
                        onClick={() => setEditingRaffle(raffle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-amber-500/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Editar Sorteio</DialogTitle>
                      </DialogHeader>
                      {editingRaffle && (
                        <form onSubmit={handleUpdateRaffle} className="space-y-4">
                          <div>
                            <Label className="text-white">Título do Sorteio</Label>
                            <Input
                              value={editingRaffle.title}
                              onChange={(e) => setEditingRaffle(prev => ({ ...prev, title: e.target.value }))}
                              className="bg-gray-700 border-amber-500/30 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Descrição</Label>
                            <Textarea
                              value={editingRaffle.description}
                              onChange={(e) => setEditingRaffle(prev => ({ ...prev, description: e.target.value }))}
                              className="bg-gray-700 border-amber-500/30 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Prêmio</Label>
                            <Input
                              value={editingRaffle.prize}
                              onChange={(e) => setEditingRaffle(prev => ({ ...prev, prize: e.target.value }))}
                              className="bg-gray-700 border-amber-500/30 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">Data de Início</Label>
                              <Input
                                type="datetime-local"
                                value={editingRaffle.startDate}
                                onChange={(e) => setEditingRaffle(prev => ({ ...prev, startDate: e.target.value }))}
                                className="bg-gray-700 border-amber-500/30 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Data de Fim</Label>
                              <Input
                                type="datetime-local"
                                value={editingRaffle.endDate}
                                onChange={(e) => setEditingRaffle(prev => ({ ...prev, endDate: e.target.value }))}
                                className="bg-gray-700 border-amber-500/30 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-white">Máximo de Participantes</Label>
                            <Input
                              type="number"
                              value={editingRaffle.maxParticipants}
                              onChange={(e) => setEditingRaffle(prev => ({ ...prev, maxParticipants: e.target.value }))}
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
                    onClick={() => handleDeleteRaffle(raffle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RaffleManagement;
