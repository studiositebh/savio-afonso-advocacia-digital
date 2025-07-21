import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Shield, Handshake } from 'lucide-react';

const Sobre = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section with Images */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-primary"></div>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
              Sobre Nós
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-in">
              <img 
                src="/lovable-uploads/7ea95670-77ae-4867-a1e2-952406df9e0d.png"
                alt="Dr. Sávio Afonso de Oliveira"
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Dr. Sávio Afonso de Oliveira
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Fundador e sócio principal do escritório, com mais de 30 anos de experiência 
                em Direito Empresarial. Reconhecido pela excelência técnica e visão estratégica 
                no desenvolvimento de soluções jurídicas inovadoras.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Especialista em reestruturações societárias, planejamento tributário e 
                operações de M&A, sempre focado em resultados que agreguem valor aos negócios 
                de seus clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                A <strong>SÁVIO AFONSO DE OLIVEIRA – ADVOCACIA EMPRESARIAL</strong> é um escritório de 
                advocacia voltado à moderna prestação de serviços jurídicos, empenhado em promover 
                estratégias personalizadas em todas as áreas do Direito de Empresa que determinem 
                desenvolvimento e rentabilidade aos seus clientes, proporcionando-lhes melhor competitividade 
                mercadológica via redução de custos e otimização de resultados.
              </p>
              
              <p>
                Com um forte núcleo de especialização nas áreas dos Direitos Econômico, Societário, 
                Trabalhista, Fiscal e Tributário bem como utilizando-se de uma estrutura operacional 
                extremamente organizada e dinâmica, portanto flexível e ágil, e ainda, com informações em 
                tempo real, a <strong>SÁVIO AFONSO DE OLIVEIRA – ADVOCACIA EMPRESARIAL</strong> atua 
                também, fortemente, em áreas ainda mais específicas das relações empresariais, tais como 
                Projetos Especiais de Recuperação Operacional e de Reorganização Societária e Patrimonial, de 
                Estruturação de Holdings Operacionais e Patrimoniais Sucessórias, de Fusões e Aquisições 
                (M&A), de Planejamento Fiscal e Tributário Nacional e Internacional, dentre outras.
              </p>
              
              <p>
                Para o desenvolvimento de suas atividades contínuas a <strong>SÁVIO AFONSO DE OLIVEIRA – 
                ADVOCACIA EMPRESARIAL</strong> conta com uma seleta equipe de especialistas, aos quais cabe a 
                responsabilidade de definir as estratégias e desenvolver os produtos e serviços jurídicos a serem 
                oferecidos ao mercado, visando sempre a melhor combinação de qualidade, agilidade, resultado e 
                relação custo-benefício.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Image Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <img 
              src="/lovable-uploads/edc58d0e-7db7-4db1-ad57-13d8afa24630.png"
              alt="Escritório Sávio Afonso"
              className="w-full max-w-4xl mx-auto h-auto object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Código de Ética */}
            <Card className="h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Nosso Código de Ética
                </h3>
                <div className="flex-grow">
                  <p className="text-gray-600 mb-4">
                    A <strong>SÁVIO AFONSO DE OLIVEIRA – ADVOCACIA EMPRESARIAL</strong> sempre orientou sua 
                    atuação através de irrepreensíveis princípios éticos fundamentados, através de toda a sua 
                    existência, por uma imagem de um escritório sólido, confiável e eficaz.
                  </p>
                  <p className="text-gray-600">
                    Estes padrões éticos refletem a identidade da <strong>SÁVIO AFONSO DE OLIVEIRA – ADVOCACIA 
                    EMPRESARIAL</strong> com os compromissos assumidos com seus clientes como verdadeiros parceiros 
                    de negócios, observando sigilo sobre os trabalhos realizados, refletindo integridade profissional e 
                    conduzindo as operações para atingir a excelência nos resultados.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Compromisso */}
            <Card className="h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Nosso Compromisso
                </h3>
                <div className="flex-grow">
                  <p className="text-gray-600 mb-4">
                    Neste momento em que o mundo vive plenamente o processo da "Globalização", em que a 
                    competitividade busca a excelência, é indispensável que os profissionais de todas as áreas 
                    busquem o constante aprimoramento de suas habilidades, potencializando assim a sua capacidade 
                    de agir sobre o mercado e de transferir oportunidades latentes em sucesso empresarial.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Nesse jogo de sobrevivência, a capacidade de elaborar a estratégia adequada determinará a 
                    diferença entre o sucesso e o insucesso, entre o êxito e o infortúnio na conquista dos objetivos 
                    traçados. Portanto, a busca permanente pela excelência técnica, pela eficácia e pelo tratamento 
                    personalizado são os pontos centrais de nosso compromisso com os nossos clientes.
                  </p>
                  <p className="text-gray-600">
                    A <strong>SÁVIO AFONSO DE OLIVEIRA – ADVOCACIA EMPRESARIAL</strong> atua com reconhecido 
                    nível de qualidade que garante uma prestação de serviços que supera as expectativas de seus 
                    clientes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Missão */}
            <Card className="h-full bg-primary text-white">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full mb-6">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  MISSÃO
                </h3>
                <div className="flex-grow">
                  <blockquote className="text-lg italic text-white/90 border-l-4 border-white/30 pl-4">
                    "Criar soluções no âmbito do Direito Empresarial que mantenham os dispêndios 
                    dos clientes nos estritos limites da Constituição e das Leis e que permitam se 
                    obtenha a melhor organização jurídica de seus negócios."
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Conheça Nossa Equipe
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Profissionais especializados e experientes prontos para oferecer as melhores soluções jurídicas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/equipe">
                Conheça Nossa Equipe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contato">
                Entre em Contato
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;