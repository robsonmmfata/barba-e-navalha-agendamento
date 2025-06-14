
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Scissors, UserPlus, LogIn, ArrowLeft } from "lucide-react";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      toast.success("Login realizado com sucesso!");
      
      // Check if admin
      if (loginData.email === 'admin@barbearia.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error("E-mail ou senha incorretos");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.phone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const success = await register(registerData.name, registerData.email, registerData.password, registerData.phone);
    
    if (success) {
      toast.success("Cadastro realizado com sucesso!");
      navigate('/dashboard');
    } else {
      toast.error("E-mail já está em uso ou erro no cadastro");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">BarberShop Premium</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Bem-vindo!</CardTitle>
              <CardDescription className="text-gray-600">
                Faça login ou crie sua conta para agendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Cadastro
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">E-mail</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className="bg-white/70"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Sua senha"
                        className="bg-white/70"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-barbershop-gold hover:bg-barbershop-gold/80 text-barbershop-dark">
                      Entrar
                    </Button>

                    <div className="text-center text-sm text-gray-600 mt-4">
                      <p>Login de teste:</p>
                      <p><strong>Admin:</strong> admin@barbearia.com / admin123</p>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Nome Completo</Label>
                      <Input
                        id="register-name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome completo"
                        className="bg-white/70"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-email">E-mail</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className="bg-white/70"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-phone">Telefone</Label>
                      <Input
                        id="register-phone"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="bg-white/70"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Crie uma senha"
                        className="bg-white/70"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-barbershop-gold hover:bg-barbershop-gold/80 text-barbershop-dark">
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
