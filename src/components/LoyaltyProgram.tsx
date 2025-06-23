
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Gift, Star, Trophy } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface LoyaltyPoints {
  clientId: string;
  points: number;
  totalSpent: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const LoyaltyProgram = () => {
  const { appointments, services } = useApp();
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useLocalStorage<LoyaltyPoints[]>('loyalty-points', []);

  const calculateUserPoints = () => {
    if (!user) return { points: 0, totalSpent: 0, tier: 'bronze' as const };

    const userAppointments = appointments.filter(apt => 
      apt.clientId === user.id && apt.status === 'concluido'
    );

    const totalSpent = userAppointments.reduce((total, apt) => {
      const service = services.find(s => s.id === apt.serviceId);
      return total + (service?.price || 0);
    }, 0);

    const points = Math.floor(totalSpent / 10); // 1 ponto a cada R$ 10
    
    let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
    if (points >= 500) tier = 'platinum';
    else if (points >= 200) tier = 'gold';
    else if (points >= 100) tier = 'silver';

    return { points, totalSpent, tier };
  };

  const { points, totalSpent, tier } = calculateUserPoints();

  const getTierBenefits = (tier: string) => {
    const benefits = {
      bronze: ['5% desconto em cortes', 'Lembrete de agendamento'],
      silver: ['10% desconto em cortes', 'Prioridade no agendamento', 'Brinde no aniversário'],
      gold: ['15% desconto em cortes', 'Atendimento VIP', 'Corte grátis a cada 10'],
      platinum: ['20% desconto em cortes', 'Atendimento exclusivo', 'Serviços premium']
    };
    return benefits[tier as keyof typeof benefits] || [];
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'bg-amber-600',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-purple-600'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-400';
  };

  const getNextTierProgress = () => {
    const thresholds = { bronze: 100, silver: 200, gold: 500 };
    
    if (tier === 'platinum') return 100;
    
    const currentThreshold = thresholds[tier as keyof typeof thresholds];
    const nextThreshold = tier === 'bronze' ? 100 : tier === 'silver' ? 200 : 500;
    
    return Math.min((points / nextThreshold) * 100, 100);
  };

  const redeemPoints = (cost: number, reward: string) => {
    if (points < cost) {
      toast.error("Pontos insuficientes");
      return;
    }

    // In a real app, this would update the user's points in the database
    toast.success(`${reward} resgatado com sucesso!`);
  };

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardContent className="text-center py-8">
          <p>Faça login para ver seu programa de fidelidade</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Programa de Fidelidade
          </CardTitle>
          <CardDescription>
            Acumule pontos e ganhe benefícios exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge className={`${getTierColor(tier)} text-white px-4 py-2 text-lg`}>
                {tier.toUpperCase()}
              </Badge>
              <div>
                <p className="text-3xl font-bold text-primary">{points}</p>
                <p className="text-sm text-gray-600">pontos</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso para o próximo nível</span>
                <span>{Math.round(getNextTierProgress())}%</span>
              </div>
              <Progress value={getNextTierProgress()} className="h-2" />
            </div>

            <p className="text-sm text-gray-600">
              Total gasto: R$ {totalSpent}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Seus benefícios atuais:</h4>
            <div className="space-y-1">
              {getTierBenefits(tier).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Resgatar Pontos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Desconto 20%</h4>
                  <p className="text-sm text-gray-600">Válido por 30 dias</p>
                </div>
                <Badge variant="outline">50 pontos</Badge>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                disabled={points < 50}
                onClick={() => redeemPoints(50, "Desconto de 20%")}
              >
                Resgatar
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Corte Grátis</h4>
                  <p className="text-sm text-gray-600">Serviço básico</p>
                </div>
                <Badge variant="outline">150 pontos</Badge>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                disabled={points < 150}
                onClick={() => redeemPoints(150, "Corte grátis")}
              >
                Resgatar
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Combo Premium</h4>
                  <p className="text-sm text-gray-600">Corte + Barba grátis</p>
                </div>
                <Badge variant="outline">300 pontos</Badge>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                disabled={points < 300}
                onClick={() => redeemPoints(300, "Combo premium")}
              >
                Resgatar
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Upgrade para VIP</h4>
                  <p className="text-sm text-gray-600">Atendimento exclusivo</p>
                </div>
                <Badge variant="outline">500 pontos</Badge>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                disabled={points < 500}
                onClick={() => redeemPoints(500, "Upgrade VIP")}
              >
                Resgatar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyProgram;
