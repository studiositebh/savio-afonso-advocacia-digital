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
                        especialista em Direito Societário, Tributário e Econômico. 
                        Graduado em Direito com especializações em Direito Empresarial 
                        e Tributário.
                      </p>
                      <p>
                        Reconhecido pela excelência técnica e visão estratégica, 
                        atua em casos de alta complexidade envolvendo reestruturações 
                        societárias, fusões e aquisições, e planejamento tributário 
                        nacional e internacional.
                      </p>
                      <p>
                        Membro de importantes associações jurídicas e palestrante 
                        em eventos do setor, contribuindo ativamente para o 
                        desenvolvimento do Direito Empresarial no Brasil.
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

      {/* Team Members Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Advogados Associados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa equipe é composta por profissionais altamente qualificados, 
              cada um especializado em áreas específicas do Direito Empresarial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder team members */}
            {[
              {
                name: "Dr. Carlos Eduardo Silva",
                position: "Sócio - Direito Tributário",
                specialization: "Especialista em Planejamento Fiscal e Contencioso Tributário",
                experience: "15 anos de experiência"
              },
              {
                name: "Dra. Marina Santos Oliveira",
                position: "Sócia - Direito Societário",
                specialization: "Especialista em M&A e Reestruturações Societárias",
                experience: "12 anos de experiência"
              },
              {
                name: "Dr. Ricardo Almeida Costa",
                position: "Advogado Sênior - Trabalhista",
                specialization: "Especialista em Compliance Trabalhista",
                experience: "10 anos de experiência"
              },
              {
                name: "Dra. Ana Paula Ferreira",
                position: "Advogada Sênior - Civil Empresarial",
                specialization: "Especialista em Contratos e Proteção Patrimonial",
                experience: "8 anos de experiência"
              },
              {
                name: "Dr. Fernando Rodrigues",
                position: "Advogado - Comércio Exterior",
                specialization: "Especialista em Regimes Aduaneiros",
                experience: "6 anos de experiência"
              },
              {
                name: "Dra. Juliana Campos",
                position: "Advogada - Compliance",
                specialization: "Especialista em LGPD e Governança Corporativa",
                experience: "5 anos de experiência"
              }
            ].map((member, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    {member.specialization}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {member.experience}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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