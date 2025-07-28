import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Linkedin, Mail } from 'lucide-react';

const Equipe = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Nossa Equipe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profissionais especializados e experientes, comprometidos em oferecer 
            as melhores soluções jurídicas empresariais.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                      Sávio Afonso de Oliveira
                    </h2>
                    <p className="text-primary font-semibold mb-4">
                      Fundador e Sócio Principal
                    </p>
                    <div className="text-gray-600 space-y-4">
                      <p>
                        Advogado empresarial com mais de 30 anos de experiência, 
                        especialista em Direito Econômico, Societário e Tributário. 
                        Graduado em Direito pela UFMG – Universidade Federal de Minas Gerais 
                        com especialização em Direito da Economia e da Empresa pela FGV – Fundação Getúlio Vargas.
                      </p>
                      <p>
                        Reconhecido pela excelência técnica e visão estratégica, 
                        atua em casos de alta complexidade envolvendo reestruturações 
                        societárias, fusões e aquisições, recuperação e proteção patrimonial 
                        e planejamento tributário nacional e internacional.
                      </p>
                      <p>
                        Professor de Graduação e Pós-Graduação, membro da Comissão de Apoio Jurídico às 
                        Micro e Pequenas Empresas da OAB/MG e palestrante em eventos do setor, 
                        contribuindo ativamente para o desenvolvimento do Direito Empresarial no Brasil.
                      </p>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Contato
                      </Button>
                    </div>
                  </div>
                  <div className="lg:h-full">
                    <img 
                      src="/lovable-uploads/7ea95670-77ae-4867-a1e2-952406df9e0d.png"
                      alt="Sávio Afonso de Oliveira"
                      className="w-full h-full object-cover min-h-96"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Units Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Nossas Unidades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa equipe é composta por profissionais altamente qualificados, 
              cada um especializado em áreas específicas do Direito Empresarial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  ARAXÁ/MG
                </h3>
                <div className="text-gray-600 space-y-2">
                  <p>Rua Astolfo Rodrigues, 17</p>
                  <p>Centro, Araxá/MG</p>
                  <p>CEP: 38183-108</p>
                  <p className="font-medium">Tel: (34) 3438-0277</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  BELO HORIZONTE/MG
                </h3>
                <div className="text-gray-600 space-y-2">
                  <p>Rua Afonso Alves Branco, 261</p>
                  <p>Serra, Belo Horizonte/MG</p>
                  <p>CEP: 30240-160</p>
                  <p className="font-medium">Tel: (31) 99974-0277</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  SÃO PAULO/SP
                </h3>
                <div className="text-gray-600 space-y-2">
                  <p>Rua Tabapuã, 474, 8º andar</p>
                  <p>Itaim Bibi, São Paulo/SP</p>
                  <p>CEP: 04533-001</p>
                  <p className="font-medium">Tel: (11) 98748-7745</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Nossos Valores
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">E</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excelência</h3>
              <p className="text-gray-600">
                Buscamos sempre a mais alta qualidade em nossos serviços jurídicos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">É</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ética</h3>
              <p className="text-gray-600">
                Conduzimos nossos trabalhos com integridade e transparência.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">E</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eficiência</h3>
              <p className="text-gray-600">
                Entregamos resultados com agilidade e eficácia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Fale com Nossa Equipe
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco para discutir como podemos ajudar 
            sua empresa com soluções jurídicas personalizadas.
          </p>
          <Button asChild size="lg">
            <Link to="/contato">
              Entre em Contato
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Equipe;