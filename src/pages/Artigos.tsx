import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Artigos = () => {
  // Mock data for articles
  const artigos = [
    {
      id: 1,
      title: "Estratégias de Planejamento Tributário para Holdings Familiares",
      summary: "Análise completa das melhores práticas para estruturação tributária de holdings familiares, considerando os aspectos sucessórios e de proteção patrimonial.",
      author: "Sávio Afonso de Oliveira",
      category: "Tributário",
      date: "2024-01-20",
      readTime: "12 min",
      featured: true
    },
    {
      id: 2,
      title: "M&A no Brasil: Tendências e Desafios Regulatórios",
      summary: "Panorama atual do mercado de fusões e aquisições brasileiro, com foco nos principais obstáculos regulatórios e oportunidades de mercado.",
      author: "Marina Santos Oliveira",
      category: "Societário",
      date: "2024-01-18",
      readTime: "10 min",
      featured: true
    },
    {
      id: 3,
      title: "Compliance Trabalhista: Implementação de Políticas Efetivas",
      summary: "Guia prático para desenvolvimento e implementação de programas de compliance trabalhista em empresas de médio e grande porte.",
      author: "Ricardo Almeida Costa",
      category: "Trabalhista",
      date: "2024-01-15",
      readTime: "8 min",
      featured: false
    },
    {
      id: 4,
      title: "Transfer Pricing: Novos Parâmetros após Decisão do STF",
      summary: "Análise detalhada dos impactos da recente decisão do Supremo Tribunal Federal sobre preços de transferência e seus reflexos práticos.",
      author: "Carlos Eduardo Silva",
      category: "Tributário",
      date: "2024-01-12",
      readTime: "15 min",
      featured: false
    },
    {
      id: 5,
      title: "LGPD na Prática: Adequação para Empresas de Tecnologia",
      summary: "Roteiro específico para adequação à Lei Geral de Proteção de Dados em empresas do setor de tecnologia e startups.",
      author: "Juliana Campos",
      category: "Compliance",
      date: "2024-01-10",
      readTime: "11 min",
      featured: false
    },
    {
      id: 6,
      title: "Regimes Aduaneiros Especiais: Oportunidades para Exportadores",
      summary: "Exploração das vantagens dos regimes aduaneiros especiais e como podem ser utilizados para otimizar operações de comércio exterior.",
      author: "Fernando Rodrigues",
      category: "Comércio Exterior",
      date: "2024-01-08",
      readTime: "9 min",
      featured: false
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Tributário': 'bg-green-100 text-green-800',
      'Societário': 'bg-purple-100 text-purple-800',
      'Trabalhista': 'bg-red-100 text-red-800',
      'Compliance': 'bg-orange-100 text-orange-800',
      'Comércio Exterior': 'bg-indigo-100 text-indigo-800',
      'Civil': 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const featuredArticles = artigos.filter(artigo => artigo.featured);
  const regularArticles = artigos.filter(artigo => !artigo.featured);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Artigos Jurídicos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Artigos especializados produzidos por nossa equipe, oferecendo 
            insights e análises aprofundadas sobre temas relevantes do Direito Empresarial.
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">
              Artigos em Destaque
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((artigo) => (
                <Card key={artigo.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary to-primary-glow h-48 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white text-center px-6">
                        {artigo.title}
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge className={getCategoryColor(artigo.category)}>
                          {artigo.category}
                        </Badge>
                        <span className="text-sm text-gray-500">{artigo.readTime}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {artigo.summary}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {artigo.author}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(artigo.date)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">
                          Ler Artigo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Todos os Artigos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((artigo) => (
              <Card key={artigo.id} className="bg-white hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={getCategoryColor(artigo.category)}>
                      {artigo.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{artigo.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                    {artigo.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {artigo.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {artigo.author}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(artigo.date)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Ler Artigo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Receba Nossos Artigos
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Cadastre-se para receber novos artigos diretamente em seu e-mail 
              e mantenha-se atualizado com as últimas análises jurídicas.
            </p>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Seu e-mail profissional"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                />
                <Button type="submit" size="lg">
                  Cadastrar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Enviamos apenas artigos de qualidade. Cancele a qualquer momento.
              </p>
            </div>
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
            Se você tem dúvidas sobre algum dos temas abordados em nossos artigos 
            ou precisa de assessoria jurídica especializada, entre em contato conosco.
          </p>
          <Button asChild size="lg">
            <Link to="/contato">
              Fale Conosco
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Artigos;