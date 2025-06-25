
-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- duração em minutos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de barbeiros
CREATE TABLE public.barbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  password TEXT, -- para login simples (em produção deve ser hash)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'concluido', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de sorteios
CREATE TABLE public.raffles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_participants INTEGER NOT NULL,
  participants JSONB NOT NULL DEFAULT '[]', -- array de strings com nome-telefone
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'encerrado', 'sorteado')),
  winner TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir dados iniciais dos serviços
INSERT INTO public.services (name, price, duration) VALUES
('Corte Tradicional', 25.00, 30),
('Corte + Barba', 35.00, 45),
('Barba Completa', 20.00, 30),
('Corte Premium', 45.00, 60);

-- Inserir dados iniciais dos barbeiros
INSERT INTO public.barbers (name, specialty, experience) VALUES
('João Silva', 'Cortes Clássicos', '8 anos'),
('Pedro Santos', 'Barbas e Bigodes', '5 anos'),
('Carlos Oliveira', 'Cortes Modernos', '10 anos');

-- Adicionar índices para melhor performance
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_barber_id ON public.appointments(barber_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_raffles_status ON public.raffles(status);

-- Habilitar Row Level Security (RLS) - inicialmente permissivo para desenvolvimento
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento (podem ser restringidas depois)
CREATE POLICY "Allow all operations on services" ON public.services FOR ALL USING (true);
CREATE POLICY "Allow all operations on barbers" ON public.barbers FOR ALL USING (true);
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations on raffles" ON public.raffles FOR ALL USING (true);
