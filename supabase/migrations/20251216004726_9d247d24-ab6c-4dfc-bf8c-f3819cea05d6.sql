-- Tabela site_settings (configurações globais - apenas 1 registro)
CREATE TABLE public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name TEXT NOT NULL DEFAULT 'Sávio Afonso de Oliveira',
  logo_url TEXT,
  primary_email TEXT,
  phones JSONB DEFAULT '[]'::jsonb,
  address JSONB DEFAULT '{}'::jsonb,
  whatsapp_url TEXT,
  working_hours TEXT,
  footer_text TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela home_sections (seções da home)
CREATE TABLE public.home_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela practice_areas (áreas de atuação)
CREATE TABLE public.practice_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  detailed_description TEXT,
  image_url TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela page_contents (páginas e SEO)
CREATE TABLE public.page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT,
  body_richtext TEXT,
  seo JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela team_members (equipe)
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela leads (formulário de contato)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  source_page TEXT DEFAULT 'contato',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário é cliente_admin ou admin
CREATE OR REPLACE FUNCTION public.is_cms_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'cliente_admin')
  );
$$;

-- RLS para site_settings
CREATE POLICY "Site settings são visíveis publicamente" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar site_settings" ON public.site_settings
  FOR ALL USING (public.is_cms_admin(auth.uid()))
  WITH CHECK (public.is_cms_admin(auth.uid()));

-- RLS para home_sections
CREATE POLICY "Seções publicadas são visíveis" ON public.home_sections
  FOR SELECT USING (status = 'published' OR public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar seções" ON public.home_sections
  FOR ALL USING (public.is_cms_admin(auth.uid()))
  WITH CHECK (public.is_cms_admin(auth.uid()));

-- RLS para practice_areas
CREATE POLICY "Áreas ativas são visíveis" ON public.practice_areas
  FOR SELECT USING (active = true OR public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar áreas" ON public.practice_areas
  FOR ALL USING (public.is_cms_admin(auth.uid()))
  WITH CHECK (public.is_cms_admin(auth.uid()));

-- RLS para page_contents
CREATE POLICY "Páginas publicadas são visíveis" ON public.page_contents
  FOR SELECT USING (status = 'published' OR public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar páginas" ON public.page_contents
  FOR ALL USING (public.is_cms_admin(auth.uid()))
  WITH CHECK (public.is_cms_admin(auth.uid()));

-- RLS para team_members
CREATE POLICY "Membros ativos são visíveis" ON public.team_members
  FOR SELECT USING (active = true OR public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar equipe" ON public.team_members
  FOR ALL USING (public.is_cms_admin(auth.uid()))
  WITH CHECK (public.is_cms_admin(auth.uid()));

-- RLS para leads
CREATE POLICY "Qualquer um pode enviar lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Apenas admins veem leads" ON public.leads
  FOR SELECT USING (public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar leads" ON public.leads
  FOR ALL USING (public.is_cms_admin(auth.uid()))
  WITH CHECK (public.is_cms_admin(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_home_sections_updated_at
  BEFORE UPDATE ON public.home_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practice_areas_updated_at
  BEFORE UPDATE ON public.practice_areas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_contents_updated_at
  BEFORE UPDATE ON public.page_contents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir registro inicial em site_settings
INSERT INTO public.site_settings (id, brand_name, primary_email, phones, address, whatsapp_url, footer_text, social_links)
VALUES (
  1,
  'Sávio Afonso de Oliveira Advogados',
  'douglas@dradigital.com.br',
  '[{"number": "(31) 99974-0277", "type": "whatsapp"}, {"number": "(34) 3438-0277", "type": "phone"}]'::jsonb,
  '{"street": "Av. Santos Dumont, 2626 - Sala 2", "city": "Uberaba", "state": "MG", "zip": "38050-400", "maps_url": "https://www.google.com/maps/search/?api=1&query=Av.+Santos+Dumont,+2626+-+Sala+2,+Uberaba+-+MG"}'::jsonb,
  'https://wa.me/5531999740277',
  '© 2025 Sávio Afonso de Oliveira Advogados. Todos os direitos reservados.',
  '{"instagram": "", "linkedin": "", "facebook": ""}'::jsonb
);

-- Inserir seções iniciais da home
INSERT INTO public.home_sections (section_key, content, status) VALUES
('hero', '{"headline": "Sávio Afonso de Oliveira Advogados", "subheadline": "Assessoria jurídica completa para proteger seus direitos e garantir tranquilidade em todas as questões legais.", "button_text": "Fale Conosco", "button_link": "/contato", "background_image": ""}'::jsonb, 'published'),
('about', '{"title": "Sobre o Escritório", "text": "Há mais de 30 anos no mercado, nosso escritório se destaca pela excelência no atendimento jurídico empresarial.", "highlight_number": "30", "highlight_label": "anos de experiência", "image": ""}'::jsonb, 'published'),
('contact_cta', '{"title": "Entre em Contato", "text": "Estamos prontos para atender você. Entre em contato conosco.", "button_text": "Enviar Mensagem"}'::jsonb, 'published');

-- Inserir áreas de atuação iniciais
INSERT INTO public.practice_areas (title, slug, short_description, icon, sort_order, active) VALUES
('Societário e M&A', 'societario-ma', 'Estruturação societária, fusões, aquisições e reorganizações empresariais.', 'Building2', 1, true),
('Fiscal e Tributário', 'fiscal-tributario', 'Planejamento tributário, consultoria fiscal e defesa em processos administrativos.', 'Calculator', 2, true),
('Civil Empresarial', 'civil-empresarial', 'Contratos, responsabilidade civil e litígios empresariais.', 'Scale', 3, true),
('Trabalhista Empresarial', 'trabalhista-empresarial', 'Consultoria trabalhista preventiva e defesa em reclamações.', 'Users', 4, true),
('Comércio Exterior', 'comercio-exterior', 'Assessoria em operações de importação e exportação.', 'Globe', 5, true),
('Compliance e Governança', 'compliance-governanca', 'Implementação de programas de compliance e governança corporativa.', 'Shield', 6, true);

-- Inserir páginas iniciais
INSERT INTO public.page_contents (page_key, title, body_richtext, seo, status) VALUES
('home', 'Home', '', '{"meta_title": "Sávio Afonso de Oliveira Advogados | Assessoria Jurídica Empresarial", "meta_description": "Escritório de advocacia com mais de 30 anos de experiência em direito empresarial, tributário, trabalhista e societário.", "noindex": false}'::jsonb, 'published'),
('privacy', 'Política de Privacidade', '<h2>Política de Privacidade</h2><p>Conteúdo da política de privacidade...</p>', '{"meta_title": "Política de Privacidade | Sávio Afonso de Oliveira Advogados", "meta_description": "Saiba como tratamos seus dados pessoais.", "noindex": false}'::jsonb, 'published'),
('terms', 'Termos de Uso', '<h2>Termos de Uso</h2><p>Conteúdo dos termos de uso...</p>', '{"meta_title": "Termos de Uso | Sávio Afonso de Oliveira Advogados", "meta_description": "Termos e condições de uso do site.", "noindex": false}'::jsonb, 'published');

-- Criar bucket para assets do site
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Políticas de storage para site-assets
CREATE POLICY "Assets do site são públicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Admins podem fazer upload de assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem atualizar assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-assets' AND public.is_cms_admin(auth.uid()));

CREATE POLICY "Admins podem deletar assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-assets' AND public.is_cms_admin(auth.uid()));