import { Link } from 'react-router-dom';
import { ArrowRight, Building, FileText, Users, Globe, Scale, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const areas = [
    {
      image: "/lovable-uploads/8e0ed547-b973-4dcd-a7d7-9ac276630b4c.png",
      title: "Societário e M&A",
      description: "Assessoria completa em holdings, fusões e aquisições (M&A), reestruturações societárias e governança corporativa."
    },
    {
      image: "/lovable-uploads/73489d5f-c20f-41a5-ac66-f6b8f0406e68.png",
      title: "Fiscal e Tributário",
      description: "Planejamento fiscal estratégico, contencioso tributário e recuperação de créditos fiscais para otimização da carga tributária."
    },
    {
      image: "/lovable-uploads/0c48838b-faff-4fab-bbbf-b2a890f6c578.png",
      title: "Civil Empresarial",
      description: "Elaboração e revisão de contratos, planejamento sucessório, proteção patrimonial e assessoria imobiliária."
    },
    {
      image: "/lovable-uploads/bf783fb3-06df-40cd-ab74-8e222bf5ae98.png",
      title: "Trabalhista Empresarial",
      description: "Gestão de passivos trabalhistas, negociações coletivas, compliance trabalhista e prevenção de contingências."
    },
    {
      image: "/lovable-uploads/1f81726a-b77d-4c9f-a5af-d9cea9807f85.png",
      title: "Comércio Exterior",
      description: "Consultoria em regimes especiais de importação e exportação, estruturação de Off Shore e Transfer Pricing."
    },
    {
      image: "/lovable-uploads/0a2cd42c-136b-4a32-899e-95279716523f.png",
      title: "Compliance e Governança",
      description: "Implementação de programas de integridade, adequação à LGPD e estruturação de governança corporativa."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-44 bg-cover bg-center" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/lovable-uploads/a3a3b309-519e-49c2-b6c8-739455ac6dce.png')`
      }}>
        <div className="container mx-auto px-4 relative text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
              Soluções Jurídicas Empresariais com Estratégia e Excelência
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Atuação especializada para empresas que buscam planejamento,
              proteção e resultado jurídico.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/projetos" className="inline-flex items-center">
                Conheça Nossos Projetos Especiais
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Apresentação */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h2 className="text-3xl font-semibold mb-3 text-gray-800">
            Sobre o Escritório
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="text-4xl font-semibold text-primary mb-4">
              +30 anos de experiência
            </div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Escritório fundado por Sávio Afonso de Oliveira, com atuação técnica, ética e
              foco em resultados estratégicos para empresas. Nossa equipe de
              advogados especializados atua com excelência nas mais diversas áreas
              do Direito Empresarial.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Comprometidos com a qualidade e eficiência, oferecemos soluções
              jurídicas personalizadas que atendem às necessidades específicas de
              cada cliente.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/sobre">
                Saiba Mais Sobre Nós
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-primary"></div>
            </div>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">
              Áreas de Atuação
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos serviços jurídicos especializados nas principais áreas do
              Direito Empresarial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => {
              return (
                <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 border-gray-100">
                  <CardContent className="p-8">
                    <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={area.image} 
                        alt={area.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {area.description}
                    </p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/areas" className="text-primary hover:text-primary/80 p-0">
                        Saiba mais
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-primary"></div>
            </div>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Contato
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Endereço</h3>
              <p className="text-gray-600 mb-4">
                Rua Astolfo Rodrigues, 17<br />
                Centro, Araxá – MG
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Contato</h3>
              <p className="text-gray-600 mb-2">+55 (34) 3438-0277</p>
              <p className="text-gray-600 mb-2">📱 +55 (31) 99974-0277</p>
              <p className="text-gray-600">juridico@savioadv.com.br</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-cover bg-center" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/lovable-uploads/a3a3b309-519e-49c2-b6c8-739455ac6dce.png')`
      }}>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-semibold text-white mb-6">
              Precisa de Assessoria Jurídica Especializada?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Nossa equipe está pronta para oferecer soluções jurídicas
              personalizadas para sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/contato">
                  Agende uma Consulta
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                <Link to="/areas">
                  Conheça Nossos Serviços
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;