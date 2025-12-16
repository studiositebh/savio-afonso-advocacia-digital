-- Insert categories for legal articles (if they don't exist)
INSERT INTO categories (name, slug, description)
VALUES 
  ('Tributário', 'tributario', 'Artigos sobre direito tributário e planejamento fiscal'),
  ('Societário', 'societario', 'Artigos sobre direito societário, M&A e governança'),
  ('Trabalhista', 'trabalhista', 'Artigos sobre direito trabalhista empresarial'),
  ('Compliance', 'compliance', 'Artigos sobre compliance, LGPD e governança corporativa'),
  ('Comércio Exterior', 'comercio-exterior', 'Artigos sobre comércio exterior e direito aduaneiro')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial articles
INSERT INTO posts (user_id, title, slug, description, content, type, status, source_name, created_at)
VALUES 
  (
    '684996a2-e557-48eb-aa11-3e0f3759b70c',
    'Estratégias de Planejamento Tributário para Holdings Familiares',
    'estrategias-planejamento-tributario-holdings-familiares',
    'Análise completa das melhores práticas para estruturação tributária de holdings familiares, considerando os aspectos sucessórios e de proteção patrimonial.',
    '<p>O planejamento tributário para holdings familiares é uma ferramenta essencial para a gestão eficiente do patrimônio familiar. Neste artigo, analisamos as principais estratégias disponíveis no ordenamento jurídico brasileiro.</p><h2>1. Estrutura da Holding Familiar</h2><p>A constituição de uma holding familiar permite centralizar a administração dos bens da família, facilitando a gestão patrimonial e a sucessão. Entre as vantagens, destacam-se:</p><ul><li>Proteção patrimonial contra riscos empresariais</li><li>Planejamento sucessório simplificado</li><li>Economia tributária na distribuição de rendimentos</li></ul><h2>2. Aspectos Tributários</h2><p>A escolha do regime tributário adequado é fundamental para maximizar os benefícios fiscais. As principais opções incluem o Lucro Presumido e o Lucro Real, cada um com suas particularidades e vantagens específicas.</p><h2>Conclusão</h2><p>O planejamento tributário bem estruturado pode resultar em economia significativa para as famílias, desde que realizado dentro dos limites legais e com acompanhamento profissional adequado.</p>',
    'article',
    'published',
    'Sávio Afonso de Oliveira',
    NOW() - INTERVAL '5 days'
  ),
  (
    '684996a2-e557-48eb-aa11-3e0f3759b70c',
    'M&A no Brasil: Tendências e Desafios Regulatórios',
    'ma-brasil-tendencias-desafios-regulatorios',
    'Panorama atual do mercado de fusões e aquisições brasileiro, com foco nos principais obstáculos regulatórios e oportunidades de mercado.',
    '<p>O mercado de M&A (Mergers and Acquisitions) no Brasil tem apresentado movimentações significativas nos últimos anos, apesar dos desafios econômicos e regulatórios.</p><h2>Cenário Atual</h2><p>O Brasil continua sendo um dos principais mercados de M&A na América Latina, atraindo investimentos de fundos nacionais e estrangeiros em diversos setores da economia.</p><h2>Principais Desafios Regulatórios</h2><ul><li>Análise pelo CADE em operações que atingem os critérios de notificação</li><li>Regulamentações setoriais específicas (energia, telecomunicações, saúde)</li><li>Due diligence trabalhista e tributária complexa</li></ul><h2>Oportunidades</h2><p>Setores como tecnologia, saúde e energia renovável têm sido os mais ativos em termos de transações, oferecendo oportunidades significativas para investidores.</p>',
    'article',
    'published',
    'Equipe Jurídica',
    NOW() - INTERVAL '10 days'
  ),
  (
    '684996a2-e557-48eb-aa11-3e0f3759b70c',
    'Compliance Trabalhista: Implementação de Políticas Efetivas',
    'compliance-trabalhista-implementacao-politicas-efetivas',
    'Guia prático para desenvolvimento e implementação de programas de compliance trabalhista em empresas de médio e grande porte.',
    '<p>O compliance trabalhista tornou-se indispensável para empresas que buscam minimizar riscos e manter um ambiente de trabalho saudável e conforme a legislação.</p><h2>Elementos Essenciais</h2><ul><li>Código de conduta e políticas internas claras</li><li>Canal de denúncias efetivo e confidencial</li><li>Treinamentos periódicos para colaboradores</li><li>Auditorias internas regulares</li></ul><h2>Benefícios da Implementação</h2><p>Empresas com programas de compliance bem estruturados tendem a apresentar menor índice de passivo trabalhista e melhor clima organizacional.</p><h2>Passos para Implementação</h2><p>A implementação deve ser gradual, começando pelo mapeamento de riscos, seguido pela elaboração de políticas e culminando com treinamentos e monitoramento contínuo.</p>',
    'article',
    'published',
    'Sávio Afonso de Oliveira',
    NOW() - INTERVAL '15 days'
  ),
  (
    '684996a2-e557-48eb-aa11-3e0f3759b70c',
    'Transfer Pricing: Novos Parâmetros após Decisão do STF',
    'transfer-pricing-novos-parametros-decisao-stf',
    'Análise detalhada dos impactos da recente decisão do Supremo Tribunal Federal sobre preços de transferência e seus reflexos práticos.',
    '<p>A regulamentação de preços de transferência no Brasil passou por transformações significativas, alinhando-se às diretrizes da OCDE e impactando empresas com operações internacionais.</p><h2>O Novo Marco Legal</h2><p>A Lei nº 14.596/2023 introduziu um novo modelo de preços de transferência, baseado no princípio arm''s length, seguindo padrões internacionais.</p><h2>Principais Mudanças</h2><ul><li>Adoção do princípio arm''s length como base</li><li>Novos métodos de precificação</li><li>Documentação mais robusta requerida</li><li>Período de transição até 2024</li></ul><h2>Impactos Práticos</h2><p>As empresas precisam revisar suas estruturas de preços e adequar sua documentação para atender aos novos requisitos regulatórios.</p>',
    'article',
    'published',
    'Equipe Jurídica',
    NOW() - INTERVAL '20 days'
  ),
  (
    '684996a2-e557-48eb-aa11-3e0f3759b70c',
    'LGPD na Prática: Adequação para Empresas de Tecnologia',
    'lgpd-pratica-adequacao-empresas-tecnologia',
    'Roteiro específico para adequação à Lei Geral de Proteção de Dados em empresas do setor de tecnologia e startups.',
    '<p>A Lei Geral de Proteção de Dados (LGPD) trouxe desafios específicos para empresas de tecnologia, que frequentemente lidam com grandes volumes de dados pessoais.</p><h2>Particularidades do Setor</h2><p>Empresas de tecnologia enfrentam desafios únicos na adequação à LGPD, incluindo:</p><ul><li>Tratamento de dados em larga escala</li><li>Uso de inteligência artificial e machine learning</li><li>Transferência internacional de dados</li><li>Desenvolvimento ágil vs. privacy by design</li></ul><h2>Passos para Adequação</h2><ol><li>Mapeamento de dados pessoais tratados</li><li>Revisão de políticas de privacidade</li><li>Implementação de medidas de segurança</li><li>Nomeação do DPO</li><li>Treinamento de colaboradores</li></ol><h2>Conclusão</h2><p>A adequação à LGPD não deve ser vista como um obstáculo, mas como uma oportunidade de construir relações mais transparentes com clientes e usuários.</p>',
    'article',
    'published',
    'Sávio Afonso de Oliveira',
    NOW() - INTERVAL '25 days'
  ),
  (
    '684996a2-e557-48eb-aa11-3e0f3759b70c',
    'Regimes Aduaneiros Especiais: Oportunidades para Exportadores',
    'regimes-aduaneiros-especiais-oportunidades-exportadores',
    'Exploração das vantagens dos regimes aduaneiros especiais e como podem ser utilizados para otimizar operações de comércio exterior.',
    '<p>Os regimes aduaneiros especiais representam importantes ferramentas de competitividade para empresas que atuam no comércio internacional.</p><h2>Principais Regimes Disponíveis</h2><ul><li><strong>Drawback:</strong> Permite a isenção ou suspensão de tributos na importação de insumos destinados à produção de bens para exportação</li><li><strong>Recof:</strong> Regime de entreposto industrial sob controle informatizado</li><li><strong>Repetro:</strong> Específico para o setor de petróleo e gás</li><li><strong>Reintegra:</strong> Devolução parcial de tributos sobre exportações</li></ul><h2>Benefícios Fiscais</h2><p>A utilização adequada destes regimes pode resultar em economia tributária significativa, aumentando a competitividade das empresas brasileiras no mercado internacional.</p><h2>Requisitos e Cuidados</h2><p>É fundamental atender aos requisitos específicos de cada regime e manter controles adequados para evitar autuações fiscais.</p>',
    'article',
    'published',
    'Equipe Jurídica',
    NOW() - INTERVAL '30 days'
  );

-- Link articles to categories
INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'estrategias-planejamento-tributario-holdings-familiares' AND c.slug = 'tributario';

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'ma-brasil-tendencias-desafios-regulatorios' AND c.slug = 'societario';

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'compliance-trabalhista-implementacao-politicas-efetivas' AND c.slug = 'trabalhista';

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'transfer-pricing-novos-parametros-decisao-stf' AND c.slug = 'tributario';

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'lgpd-pratica-adequacao-empresas-tecnologia' AND c.slug = 'compliance';

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'regimes-aduaneiros-especiais-oportunidades-exportadores' AND c.slug = 'comercio-exterior';