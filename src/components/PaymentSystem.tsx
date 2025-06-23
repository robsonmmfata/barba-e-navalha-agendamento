
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Smartphone, DollarSign, Receipt } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import LoadingSpinner from "./LoadingSpinner";

interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'pix' | 'credit' | 'debit' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

const PaymentSystem = () => {
  const [payments, setPayments] = useLocalStorage<Payment[]>('barbershop-payments', []);
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'credit' | 'debit' | 'cash'>('pix');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixKey, setPixKey] = useState('');

  const processPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const newPayment: Payment = {
        id: Date.now().toString(),
        appointmentId: 'mock-appointment',
        amount: parseFloat(amount),
        method: selectedMethod,
        status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% success rate
        date: new Date().toISOString()
      };

      setPayments(prev => [...prev, newPayment]);
      
      if (newPayment.status === 'completed') {
        toast.success(`Pagamento de R$ ${amount} realizado com sucesso via ${getMethodName(selectedMethod)}!`);
        setAmount('');
      } else {
        toast.error("Falha no processamento do pagamento. Tente novamente.");
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  const generatePixQR = () => {
    // In a real app, this would generate a proper PIX QR code
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136${pixKey}0208Barbearia5204000053039865802BR5913Barbearia6009SAO PAULO62070503***6304`;
    return pixCode;
  };

  const getMethodName = (method: string) => {
    const names = {
      pix: 'PIX',
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito',
      cash: 'Dinheiro'
    };
    return names[method as keyof typeof names];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((total, p) => total + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Payment Form */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Sistema de Pagamentos
          </CardTitle>
          <CardDescription>
            Processe pagamentos dos clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <Label>Método de Pagamento</Label>
            <Select value={selectedMethod} onValueChange={(value: any) => setSelectedMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    PIX
                  </div>
                </SelectItem>
                <SelectItem value="credit">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                  </div>
                </SelectItem>
                <SelectItem value="debit">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Débito
                  </div>
                </SelectItem>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Dinheiro
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedMethod === 'pix' && (
            <div>
              <Label>Chave PIX da Barbearia</Label>
              <Input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Digite sua chave PIX"
              />
              {pixKey && (
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono break-all">
                  <p className="mb-2 font-bold">Código PIX:</p>
                  {generatePixQR()}
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={processPayment} 
            className="w-full"
            disabled={isProcessing || !amount}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processando...
              </div>
            ) : (
              `Processar Pagamento - R$ ${amount || '0,00'}`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Pagamentos Hoje</p>
              <p className="text-2xl font-bold text-blue-600">
                {payments.filter(p => {
                  const today = new Date().toDateString();
                  return new Date(p.date).toDateString() === today;
                }).length}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-purple-600">
                {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Recent Payments */}
          <div>
            <h4 className="font-medium mb-3">Pagamentos Recentes</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {payments.slice(-10).reverse().map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(payment.status)} text-white`}>
                      {payment.status}
                    </Badge>
                    <div>
                      <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{getMethodName(payment.method)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhum pagamento registrado</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSystem;
