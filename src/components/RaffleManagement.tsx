
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
    start_date: "",
    end_date: "",
    max_participants: "",
  });

  const handleAddRaffle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRaffle.title || !newRaffle.prize || !newRaffle.start_date || !newRaffle.end_date || !newRaffle.max_participants) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const startDate = new Date(newRaffle.start_date);
    const endDate = new Date(newRaffle.end_date);
    
    if (endDate <= startDate) {
      toast.error("A data de fim deve ser posterior à data de início");
      return;
    }

    if (Number(newRaffle.max_participants) <= 0) {
      toast.error("O número máximo de participantes deve ser maior que zero");
      return;
    }

    try {
      addRaffle({
        title: newRaffle.title,
        description: newRaffle.description || "",
        prize: newRaffle.prize,
        start_date: newRaffle.start_date,
        end_date: newRaffle.end_date,
        max_participants: Number(newRaffle.max_participants),
      });

      toast.success("Sorteio criado com sucesso!");
      setNewRaffle({ title: "", description: "", prize: "", start_date: "", end_date: "", max_participants: "" });
      setIsAddRaffleOpen(false);
    } catch (error) {
      toast.error("Erro ao criar sorteio. Tente novamente.");
    }
  };

  const handleUpdateRaffle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRaffle || !editingRaffle.title || !editingRaffle.prize) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      updateRaffle(editingRaffle.id, {
        title: editingRaffle.title,
        description: editingRaffle.description,
        prize: editingRaffle.prize,
        start_date: editingRaffle.start_date,
        end_date: editingRaffle.end_date,
        max_participants: Number(editingRaffle.max_participants),
      });

      toast.success("Sorteio atualizado com sucesso!");
      setEditingRaffle(null);
    } catch (error) {
      toast.error("Erro ao atualizar sorteio. Tente novamente.");
    }
  };

  const handleDeleteRaffle = (id: string) => {
    try {
      deleteRaffle(id);
      toast.success("Sorteio removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover sorteio. Tente novamente.");
    }
  };

  const handleDrawWinner = async (raffleId: string) => {
    try {
      const winner = await drawRaffleWinner(raffleId);
      if (winner) {
        toast.success(`Ganhador sorteado: ${winner.split('-')[0]}`);
      } else {
        toast.error("Não foi possível sortear um ganhador. Verifique se há participantes.");
      }
    } catch (error) {
      toast.error("Erro ao sortear ganhador. Tente novamente.");
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
            <DialogContent className="bg-gray-800 border-amber-500/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Sorteio</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Preencha os dados do novo sorteio
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRaffle} className="space-y-4">
                <div>
                  <Label htmlFor="raffle-title" className="text-white">
                    Título do Sorteio *
                  </Label>
                  <Input
                    id="raffle-title"
                    value={newRaffle.title}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="Ex: Sorteio Corte Grátis"
                    required
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
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="raffle-prize" className="text-white">
                    Prêmio *
                  </Label>
                  <Input
                    id="raffle-prize"
                    value={newRaffle.prize}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, prize: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="Ex: Corte + Barba Grátis"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="raffle-start" className="text-white">
                      Data de Início *
                    </Label>
                    <Input
                      id="raffle-start"
                      type="datetime-local"
                      value={newRaffle.start_date}
                      onChange={(e) => setNewRaffle(prev => ({ ...prev, start_date: e.target.value }))}
                      className="bg-gray-700 border-amber-500/30 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="raffle-end" className="text-white">
                      Data de Fim *
                    </Label>
                    <Input
                      id="raffle-end"
                      type="datetime-local"
                      value={newRaffle.end_date}
                      onChange={(e) => setNewRaffle(prev => ({ ...prev, end_date: e.target.value }))}
                      className="bg-gray-700 border-amber-500/30 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="raffle-max" className="text-white">
                    Máximo de Participantes *
                  </Label>
                  <Input
                    id="raffle-max"
                    type="number"
                    min="1"
                    value={newRaffle.max_participants}
                    onChange={(e) => setNewRaffle(prev => ({ ...prev, max_participants: e.target.value }))}
                    className="bg-gray-700 border-amber-500/30 text-white"
                    placeholder="100"
                    required
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
          {raffles.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum sorteio criado ainda</p>
              <p className="text-gray-500 text-sm">Clique em "Novo Sorteio" para começar</p>
            </div>
          ) : (
            raffles.map((raffle) => (
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
                        {raffle.participants.length}/{raffle.max_participants}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${getStatusColor(raffle.status)} text-white`}>
                        {raffle.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {format(new Date(raffle.start_date), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(raffle.end_date), "dd/MM/yyyy", { locale: ptBR })}
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
                      <DialogContent className="bg-gray-800 border-amber-500/20 max-w-md">
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
                                rows={3}
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
                                  value={editingRaffle.start_date}
                                  onChange={(e) => setEditingRaffle(prev => ({ ...prev, start_date: e.target.value }))}
                                  className="bg-gray-700 border-amber-500/30 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Data de Fim</Label>
                                <Input
                                  type="datetime-local"
                                  value={editingRaffle.end_date}
                                  onChange={(e) => setEditingRaffle(prev => ({ ...prev, end_date: e.target.value }))}
                                  className="bg-gray-700 border-amber-500/30 text-white"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-white">Máximo de Participantes</Label>
                              <Input
                                type="number"
                                min="1"
                                value={editingRaffle.max_participants}
                                onChange={(e) => setEditingRaffle(prev => ({ ...prev, max_participants: e.target.value }))}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RaffleManagement;
