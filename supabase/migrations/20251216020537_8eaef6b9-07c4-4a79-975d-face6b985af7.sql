-- Tabela de planos de IA
CREATE TABLE public.ai_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_credits INTEGER NOT NULL,
  price_brl DECIMAL(10,2) NOT NULL,
  stripe_price_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de assinaturas de IA
CREATE TABLE public.ai_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.ai_plans(id),
  provider TEXT DEFAULT 'stripe',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'pending')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de uso de créditos
CREATE TABLE public.ai_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 month'),
  used_credits INTEGER NOT NULL DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de log de gerações
CREATE TABLE public.ai_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  inputs_json JSONB,
  output_json JSONB,
  regeneration_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ai_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- Políticas para ai_plans (público pode ver planos ativos)
CREATE POLICY "Planos ativos são visíveis" ON public.ai_plans
  FOR SELECT USING (active = true);

CREATE POLICY "Admins podem gerenciar planos" ON public.ai_plans
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Políticas para ai_subscriptions
CREATE POLICY "Usuários veem suas assinaturas" ON public.ai_subscriptions
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Sistema pode criar assinaturas" ON public.ai_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema pode atualizar assinaturas" ON public.ai_subscriptions
  FOR UPDATE USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Políticas para ai_usage
CREATE POLICY "Usuários veem seu uso" ON public.ai_usage
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Sistema pode gerenciar uso" ON public.ai_usage
  FOR ALL USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Políticas para ai_generations
CREATE POLICY "Usuários veem suas gerações" ON public.ai_generations
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Usuários podem criar gerações" ON public.ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas gerações" ON public.ai_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- Inserir planos iniciais
INSERT INTO public.ai_plans (name, monthly_credits, price_brl) VALUES
  ('Essencial', 8, 100.00),
  ('Profissional', 20, 200.00),
  ('Ilimitado', 60, 400.00);

-- Trigger para updated_at
CREATE TRIGGER update_ai_subscriptions_updated_at
  BEFORE UPDATE ON public.ai_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();