import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, FileText, Scale, Users, Globe, Shield, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const Areas = () => {
  const [expandedArea, setExpandedArea] = useState<number | null>(null);

  const areas = [
    {
      icon: Building,
      title: "Societário e M&A",
      description: "Assessoria completa em holdings, fusões e aquisições (M&A), reestruturações societárias e governança corporativa.",
      detailedInfo: "Nossa área de Direito Econômico e Societário oferece consultoria especializada em estruturação de holdings familiares e empresariais, planejamento sucessório, fusões e aquisições (M&A), joint ventures, reorganizações societárias, governança corporativa, due diligence, e assessoria em investimentos estrangeiros. Atuamos também na elaboração de acordos de acionistas, contratos de compra e venda de participações societárias, e na implementação de estruturas de proteção patrimonial.",
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a"
    },
    {
      icon: FileText,
      title: "Fiscal e Tributário",
      description: "Planejamento fiscal estratégico, contencioso tributário e recuperação de créditos fiscais para otimização da carga tributária.",
      detailedInfo: "Especialização em planejamento tributário preventivo e corretivo, elisão fiscal, contencioso administrativo e judicial tributário, recuperação de créditos fiscais, consultoria em regimes especiais de tributação, análise de incentivos fiscais, restructuring fiscal, transfer pricing, e assessoria em operações com impacto tributário significativo. Oferecemos também suporte em processos de fiscalização e auto de infração.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      icon: Scale,
      title: "Civil Empresarial",
      description: "Elaboração e revisão de contratos, planejamento sucessório, proteção patrimonial e assessoria imobiliária.",
      detailedInfo: "Atuação abrangente em Direito Civil aplicado às relações empresariais, incluindo elaboração e revisão de contratos complexos, planejamento sucessório empresarial, proteção patrimonial através de blindagem patrimonial, assessoria imobiliária corporativa, direito de família empresarial, holding familiar, e estruturação de negócios imobiliários. Prestamos consultoria também em questões relacionadas à responsabilidade civil empresarial.",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
    },
    {
      icon: Users,
      title: "Trabalhista Empresarial",
      description: "Gestão de passivos trabalhistas, negociações coletivas, compliance trabalhista e prevenção de contingências.",
      detailedInfo: "Consultoria preventiva e contenciosa em Direito do Trabalho, incluindo auditoria trabalhista, elaboração de políticas internas, compliance trabalhista, negociações coletivas, reestruturações com impacto trabalhista, terceirização, programa de demissão voluntária (PDV), assessoria em fusões e aquisições com foco trabalhista, e defesa em ações trabalhistas. Oferecemos também treinamentos e capacitação em legislação trabalhista.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb"
    },
    {
      icon: Globe,
      title: "Comércio Exterior",
      description: "Consultoria em regimes especiais de importação e exportação, estruturação de Off Shore e Transfer Pricing.",
      detailedInfo: "Assessoria especializada em operações de comércio exterior, incluindo regimes aduaneiros especiais, drawback, RECOF, entreposto aduaneiro, admissão temporária, consultoria em classificação fiscal de mercadorias, origem de produtos, acordos comerciais internacionais, defesa em processos administrativos na área aduaneira, estruturação de operações offshore, e implementação de políticas de transfer pricing conforme legislação brasileira e internacional.",
      image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151"
    },
    {
      icon: Shield,
      title: "Compliance e Governança",
      description: "Implementação de programas de integridade, adequação à LGPD e estruturação de governança corporativa.",
      detailedInfo: "Desenvolvimento e implementação de programas de compliance e integridade corporativa, adequação à Lei Geral de Proteção de Dados (LGPD), estruturação de governança corporativa, elaboração de códigos de ética e conduta, políticas anticorrupção, due diligence de integridade, treinamentos em compliance, auditoria de conformidade, e assessoria em investigações internas. Atuamos também na adequação a regulamentações setoriais específicas.",
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a"
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedArea(expandedArea === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Áreas de Atuação
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos serviços jurídicos especializados nas principais áreas do
            Direito Empresarial, com foco em soluções estratégicas e resultados efetivos.
          </p>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => {
              const IconComponent = area.icon;
              const isExpanded = expandedArea === index;
              
              return (
                <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 border-gray-100">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {area.description}
                    </p>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mb-4 animate-in slide-in-from-top-2 duration-300">
                        <img 
                          src={area.image} 
                          alt={area.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {area.detailedInfo}
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpanded(index)}
                      className="text-primary hover:text-primary/80 p-0 w-full justify-between"
                    >
                      <span className="flex items-center">
                        Saiba mais
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Precisa de Consultoria Especializada?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para oferecer soluções jurídicas personalizadas 
            para sua empresa em qualquer uma de nossas áreas de especialização.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <a href="/contato">
                Agende uma Consulta
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/projetos">
                Conheça Nossos Projetos
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Areas;