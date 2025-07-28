import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, TrendingUp, Shuffle, Shield, Recycle, Calculator } from 'lucide-react';

const Projetos = () => {
  const projetos = [
    {
      id: 1,
      icon: Recycle,
      title: "Recuperação Operacional dos Negócios e Preservação Patrimonial",
      description: "Estratégias jurídicas e econômicas para saneamento do endividamento empresarial e a preservação do patrimônio.",
      detailedDescription: "Estruturamos estratégias e implementamos ações de saneamento de todo o endividamento visando a equalização do fluxo de caixa. Nosso objetivo é viabilizar a operacionalidade dos negócios e, assim, afastar uma eventual falência e, ao mesmo tempo, preservar o patrimônio da empresa e dos sócios/acionistas.",
      benefits: [
        "Saneamento do endividamento",
        "Afastamento da falência",
        "Preservação do patrimônio",
        "Viabilizar a sucessão empresarial"
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
      id: 2,
      icon: Building2,
      title: "Estruturação de Holdings",
      description: "Planejamento e implementação de estruturas societárias para proteção patrimonial e otimização fiscal.",
      detailedDescription: "Nosso projeto de estruturação de holdings engloba o planejamento completo de arquiteturas societárias, considerando aspectos tributários, sucessórios e de proteção patrimonial. Desenvolvemos soluções personalizadas que atendem às necessidades específicas de cada família ou grupo empresarial, sempre em conformidade com a legislação vigente.",
      benefits: [
        "Proteção patrimonial efetiva",
        "Otimização da carga tributária",
        "Facilitação do processo sucessório",
        "Organização da governança familiar"
      ],
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a"
    },
    {
      id: 3,
      icon: Shuffle,
      title: "Reorganização Societária",
      description: "Reestruturação de grupos empresariais para otimização operacional, fiscal e sucessória.",
      detailedDescription: "Conduzimos processos complexos de reorganização societária, incluindo fusões, cisões, incorporações e transformações. Nosso objetivo é otimizar a estrutura corporativa para melhorar eficiência operacional, reduzir custos tributários e facilitar processos de governança e sucessão.",
      benefits: [
        "Otimização da estrutura corporativa",
        "Redução de custos operacionais",
        "Melhoria da governança",
        "Facilitação de processos de M&A"
      ],
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
    },
    {
      id: 4,
      icon: Shield,
      title: "Proteção Patrimonial Avançada",
      description: "Estratégias jurídicas para blindagem patrimonial e planejamento sucessório de empresários e famílias.",
      detailedDescription: "Implementamos estratégias avançadas de proteção patrimonial utilizando institutos como trust, fundos de investimento exclusivos, seguros de vida, previdência privada e estruturas societárias complexas. Nosso foco é proteger o patrimônio familiar contra contingências empresariais e facilitar a transmissão geracional.",
      benefits: [
        "Blindagem contra contingências",
        "Planejamento sucessório eficiente",
        "Diversificação de investimentos",
        "Preservação do patrimônio familiar"
      ],
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544"
    },
    {
      id: 5,
      icon: Calculator,
      title: "Planejamento Tributário em face da Reforma Tributária",
      description: "Estratégias fiscais e tributárias para empresas nacionais e transnacionais considerando a Reforma Tributária (IVA Dual - EC 132/23).",
      detailedDescription: "Oferecemos consultoria e desenvolvemos estratégias específicas para empresas com operações nacionais e transnacionais, antecipando as distorções e as contingências da reforma visando, assim, afastar dupla tributação ou mesmo tributação indevida. Nosso foco é otimizar a carga tributária incidente durante a implementação do IVA Dual mantendo total conformidade regulatória.",
      benefits: [
        "Transição eficaz quanto aos modelos tributários distintos",
        "Adaptação dos negócios à nova carga tributária",
        "Redução dos impactos da reforma tributária",
        "Efetiva segurança jurídica"
      ],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Planejamento Tributário Internacional",
      description: "Estratégias fiscais para empresas com operações internacionais, considerando acordos e tratados.",
      detailedDescription: "Desenvolvemos estratégias sofisticadas de planejamento tributário para empresas com operações transnacionais, aproveitando tratados para evitar dupla tributação, regimes de transparência fiscal e estruturas de holding internacional. Nosso foco é minimizar a carga tributária global mantendo total conformidade regulatória.",
      benefits: [
        "Redução da carga tributária global",
        "Aproveitamento de tratados internacionais",
        "Estruturação de operações offshore",
        "Compliance com regulamentações internacionais"
      ],
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Projetos Especiais
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluções jurídicas estratégicas e personalizadas para demandas
            empresariais complexas, desenvolvidas com expertise e inovação.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projetos.map((projeto) => {
              const IconComponent = projeto.icon;
              return (
                <Card key={projeto.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-2 bg-primary"></div>
                      <div className="flex-1">
                        <div className="p-8">
                          <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          
                          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                            {projeto.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-6">
                            {projeto.description}
                          </p>
                          
                          <div className="mb-6">
                            <img 
                              src={projeto.image}
                              alt={projeto.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Descrição Detalhada:</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {projeto.detailedDescription}
                            </p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Principais Benefícios:</h4>
                            <ul className="space-y-2">
                              {projeto.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button asChild className="w-full">
                            <Link to="/contato">
                              Saiba mais
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Nosso Processo de Trabalho
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Metodologia estruturada para garantir os melhores resultados em projetos especiais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Diagnóstico",
                description: "Análise completa da situação atual e identificação de necessidades específicas."
              },
              {
                step: "02", 
                title: "Planejamento",
                description: "Desenvolvimento de estratégia personalizada com cronograma e marcos definidos."
              },
              {
                step: "03",
                title: "Implementação",
                description: "Execução do projeto com acompanhamento constante e ajustes quando necessários."
              },
              {
                step: "04",
                title: "Monitoramento",
                description: "Acompanhamento contínuo dos resultados e otimizações periódicas."
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {process.title}
                </h3>
                <p className="text-gray-600">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Pronto para Iniciar seu Projeto Especial?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe está preparada para desenvolver soluções jurídicas 
            inovadoras e personalizadas para os desafios mais complexos de sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/contato">
                Agende uma Consulta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sobre">
                Conheça Nossa Equipe
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projetos;