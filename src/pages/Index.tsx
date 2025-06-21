import "./Index.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Scissors, Clock, Users, Star, MapPin, Phone, Calendar } from "lucide-react";
import RaffleSection from "@/components/RaffleSection";

const Index = () => {
  const services = [
    { name: "Corte Tradicional", price: "R$ 25", time: "30min", icon: Scissors },
    { name: "Corte + Barba", price: "R$ 35", time: "45min", icon: Scissors },
    { name: "Barba Completa", price: "R$ 20", time: "30min", icon: Scissors },
    { name: "Corte Premium", price: "R$ 45", time: "60min", icon: Scissors },
  ];

  const barbers = [
    { name: "João Silva", specialty: "Cortes Clássicos", experience: "8 anos" },
    { name: "Pedro Santos", specialty: "Barbas e Bigodes", experience: "5 anos" },
    { name: "Carlos Oliveira", specialty: "Cortes Modernos", experience: "10 anos" },
  ];

  return (
    <div className="index-dark-theme min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent"></div>
        <div className="container mx-auto px-4 pt-32 relative z-10">
          <nav className="fixed top-0 left-0 w-full bg-barbershop-gold flex justify-between items-center py-6 px-8 z-50 shadow-md">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold text-foreground">BarberShop Premium</h1>
            </div>
            <div className="space-x-4">
              <Link to="/agendamento">
                <Button className="bg-accent hover:bg-accent/80 text-background font-semibold">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background">
                  Admin
                </Button>
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="text-center py-20 animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-shadow">
              Estilo que
              <span className="text-accent"> Marca</span>
            </h2>
            <p className="text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto">
              Experimente o melhor em cortes masculinos com nossos profissionais especializados.
              Tradição, qualidade e estilo em cada serviço.
            </p>
            <Link to="/agendamento">
              <Button size="lg" className="bg-accent hover:bg-accent/80 text-background font-bold text-lg px-8 py-4 hover-lift">
                <Calendar className="mr-2 h-5 w-5" />
                Agende Seu Horário
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Nossos Serviços</h3>
            <p className="text-secondary-foreground text-lg">Qualidade premium em cada detalhe</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-card border-barbershop-gold/20 hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <service.icon className="h-12 w-12 text-barbershop-gold mx-auto mb-4" />
                  <CardTitle className="text-card-foreground">{service.name}</CardTitle>
                  <CardDescription className="text-secondary-foreground">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {service.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="bg-barbershop-gold text-barbershop-dark font-bold text-lg px-4 py-2">
                    {service.price}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Raffles Section */}
      <RaffleSection />

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Nossa Equipe</h3>
            <p className="text-secondary-foreground text-lg">Profissionais experientes e especializados</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {barbers.map((barber, index) => (
              <Card key={index} className="bg-card border-barbershop-gold/20 hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-barbershop-dark" />
                  </div>
                  <CardTitle className="text-card-foreground">{barber.name}</CardTitle>
                  <CardDescription className="text-barbershop-gold font-semibold">
                    {barber.specialty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center text-secondary-foreground">
                    <Star className="h-4 w-4 text-barbershop-gold mr-2" />
                    {barber.experience} de experiência
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-black/70">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h3 className="text-4xl font-bold text-white mb-6">Horário de Funcionamento</h3>
              <div className="space-y-4 text-secondary-foreground">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-barbershop-gold mr-3" />
                  <span className="font-semibold mr-4">Segunda a Sexta:</span>
                  <span>08:00 - 20:00</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-barbershop-gold mr-3" />
                  <span className="font-semibold mr-4">Sábado:</span>
                  <span>08:00 - 18:00</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-barbershop-gold mr-3" />
                  <span className="font-semibold mr-4">Domingo:</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-white mb-6">Contato & Localização</h3>
              <div className="space-y-4 text-secondary-foreground">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-barbershop-gold mr-3" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-barbershop-gold mr-3" />
                  <span>Rua da Barbearia, 123 - Centro</span>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/agendamento">
                  <Button size="lg" className="bg-barbershop-gold hover:bg-barbershop-gold/80 text-barbershop-dark font-bold hover-lift">
                    <Calendar className="mr-2 h-5 w-5" />
                    Fazer Agendamento
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scissors className="h-6 w-6 text-barbershop-gold" />
            <span className="text-white font-bold">BarberShop Premium</span>
          </div>
          <p className="text-gray-400">© 2024 BarberShop Premium. Robson Alex Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
