-- Atualizar as áreas de atuação com os textos corretos do site

UPDATE practice_areas SET 
  short_description = 'Assessoria completa em holdings, fusões e aquisições (M&A), reestruturações societárias e governança corporativa.',
  detailed_description = 'Nossa área de Direito Econômico e Societário oferece consultoria especializada em estruturação de holdings familiares e empresariais, planejamento sucessório, fusões e aquisições (M&A), joint ventures, reorganizações societárias, governança corporativa, due diligence, e assessoria em investimentos estrangeiros. Atuamos também na elaboração de acordos de acionistas, contratos de compra e venda de participações societárias, e na implementação de estruturas de proteção patrimonial.',
  image_url = '/lovable-uploads/80d011c6-45cc-485a-bde6-a07cadce431b.png'
WHERE slug = 'societario-ma';

UPDATE practice_areas SET 
  short_description = 'Planejamento fiscal estratégico, contencioso tributário e recuperação de créditos fiscais para otimização da carga tributária.',
  detailed_description = 'Especialização em planejamento tributário preventivo e corretivo, elisão fiscal, contencioso administrativo e judicial tributário, recuperação de créditos fiscais, consultoria em regimes especiais de tributação, análise de incentivos fiscais, restructuring fiscal, transfer pricing, e assessoria em operações com impacto tributário significativo. Oferecemos também suporte em processos de fiscalização e auto de infração.',
  image_url = '/lovable-uploads/73489d5f-c20f-41a5-ac66-f6b8f0406e68.png'
WHERE slug = 'fiscal-tributario';

UPDATE practice_areas SET 
  short_description = 'Elaboração e revisão de contratos, planejamento sucessório, proteção patrimonial e assessoria imobiliária.',
  detailed_description = 'Atuação abrangente em Direito Civil aplicado às relações empresariais, incluindo elaboração e revisão de contratos complexos, planejamento sucessório empresarial, proteção patrimonial através de blindagem patrimonial, assessoria imobiliária corporativa, direito de família empresarial, holding familiar, e estruturação de negócios imobiliários. Prestamos consultoria também em questões relacionadas à responsabilidade civil empresarial.',
  image_url = '/lovable-uploads/0c48838b-faff-4fab-bbbf-b2a890f6c578.png'
WHERE slug = 'civil-empresarial';

UPDATE practice_areas SET 
  short_description = 'Gestão de passivos trabalhistas, negociações coletivas, compliance trabalhista e prevenção de contingências.',
  detailed_description = 'Consultoria preventiva e contenciosa em Direito do Trabalho, incluindo auditoria trabalhista, elaboração de políticas internas, compliance trabalhista, negociações coletivas, reestruturações com impacto trabalhista, terceirização, programa de demissão voluntária (PDV), assessoria em fusões e aquisições com foco trabalhista, e defesa em ações trabalhistas. Oferecemos também treinamentos e capacitação em legislação trabalhista.',
  image_url = '/lovable-uploads/bf783fb3-06df-40cd-ab74-8e222bf5ae98.png'
WHERE slug = 'trabalhista-empresarial';

UPDATE practice_areas SET 
  short_description = 'Consultoria em regimes especiais de importação e exportação, estruturação de Off Shore e Transfer Pricing.',
  detailed_description = 'Assessoria especializada em operações de comércio exterior, incluindo regimes aduaneiros especiais, drawback, RECOF, entreposto aduaneiro, admissão temporária, consultoria em classificação fiscal de mercadorias, origem de produtos, acordos comerciais internacionais, defesa em processos administrativos na área aduaneira, estruturação de operações offshore, e implementação de políticas de transfer pricing conforme legislação brasileira e internacional.',
  image_url = '/lovable-uploads/1f81726a-b77d-4c9f-a5af-d9cea9807f85.png'
WHERE slug = 'comercio-exterior';

UPDATE practice_areas SET 
  short_description = 'Implementação de programas de integridade, adequação à LGPD e estruturação de governança corporativa.',
  detailed_description = 'Desenvolvimento e implementação de programas de compliance e integridade corporativa, adequação à Lei Geral de Proteção de Dados (LGPD), estruturação de governança corporativa, elaboração de códigos de ética e conduta, políticas anticorrupção, due diligence de integridade, treinamentos em compliance, auditoria de conformidade, e assessoria em investigações internas. Atuamos também na adequação a regulamentações setoriais específicas.',
  image_url = '/lovable-uploads/0a2cd42c-136b-4a32-899e-95279716523f.png'
WHERE slug = 'compliance-governanca';