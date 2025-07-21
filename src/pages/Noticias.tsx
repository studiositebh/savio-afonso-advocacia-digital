import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, ArrowRight } from 'lucide-react';

const Noticias = () => {
  // Mock data for news articles
  const noticias = [
    {
      id: 1,
      title: "Nova Lei de Recuperação Judicial Empresarial é Sancionada",
      summary: "Mudanças significativas no processo de recuperação judicial prometem agilizar procedimentos e proteger melhor credores e devedores.",
      category: "Legislação",
      date: "2024-01-15",
      source: "Valor Econômico",
      link: "#"
    },
    {
      id: 2,
      title: "STF Define Novos Parâmetros para Transfer Pricing",
      summary: "Supremo Tribunal Federal estabelece critérios mais claros para análise de preços de transferência em operações internacionais.",
      category: "Tributário",
      date: "2024-01-12",
      source: "Estadão",
      link: "#"
    },
    {
      id: 3,
      title: "Marco do Saneamento: Impactos Societários para Empresas do Setor",
      summary: "Análise dos reflexos do novo marco legal do saneamento nas estruturas societárias e oportunidades de investimento.",
      category: "Societário",
      date: "2024-01-10",
      source: "Folha de S.Paulo",
      link: "#"
    },
    {
      id: 4,
      title: "Avanços na Regulamentação da LGPD para Empresas",
      summary: "ANPD publica novas diretrizes para implementação de programas de proteção de dados pessoais em ambiente corporativo.",
      category: "Compliance",
      date: "2024-01-08",
      source: "O Globo",
      link: "#"
    },
    {
      id: 5,
      title: "Reforma Trabalhista: Tendências para 2024",
      summary: "Especialistas apontam principais mudanças esperadas na legislação trabalhista e seus impactos nas relações empresariais.",
      category: "Trabalhista",
      date: "2024-01-05",
      source: "Revista Consultor Jurídico",
      link: "#"
    },
    {
      id: 6,
      title: "Comércio Exterior: Novas Facilidades Aduaneiras",
      summary: "Receita Federal anuncia simplificação de processos para importação e exportação, beneficiando empresas do setor.",
      category: "Comércio Exterior",
      date: "2024-01-03",
      source: "DCI",
      link: "#"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Legislação': 'bg-blue-100 text-blue-800',
      'Tributário': 'bg-green-100 text-green-800',
      'Societário': 'bg-purple-100 text-purple-800',
      'Compliance': 'bg-orange-100 text-orange-800',
      'Trabalhista': 'bg-red-100 text-red-800',
      'Comércio Exterior': 'bg-indigo-100 text-indigo-800'
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

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Notícias Jurídicas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe as principais notícias e atualizações do mundo jurídico 
            empresarial que podem impactar seus negócios.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((noticia) => (
              <Card key={noticia.id} className="hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getCategoryColor(noticia.category)}>
                      {noticia.category}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(noticia.date)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                    {noticia.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {noticia.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Fonte: {noticia.source}
                    </span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ler mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Receba Atualizações Jurídicas
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Cadastre-se para receber em seu e-mail as principais notícias 
              e análises jurídicas selecionadas por nossa equipe.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Seu e-mail profissional"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <Button type="submit" size="lg">
                  Cadastrar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Enviamos apenas conteúdo relevante. Você pode cancelar a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              Categorias de Notícias
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore notícias organizadas por área de atuação
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Legislação', 'Tributário', 'Societário', 'Compliance', 'Trabalhista', 'Comércio Exterior'].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center text-center hover:bg-primary hover:text-white transition-colors"
              >
                <span className="font-medium">{category}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Noticias;