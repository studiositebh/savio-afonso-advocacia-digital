import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Artigo {
  id: string;
  title: string;
  description: string;
  source_name: string;
  created_at: string;
  featured_image?: string;
  post_categories: {
    categories: {
      name: string;
    };
  }[];
}

const Artigos = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtigos();
  }, []);

  const fetchArtigos = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          source_name,
          created_at,
          featured_image,
          post_categories (
            categories (
              name
            )
          )
        `)
        .eq('type', 'article')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtigos(data || []);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // First 2 articles are featured
  const featuredArticles = artigos.slice(0, 2);
  const regularArticles = artigos.slice(2);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                    <div className="bg-gradient-to-r from-primary to-primary/70 h-48 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white text-center px-6">
                        {artigo.title}
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        {artigo.post_categories[0] && (
                          <Badge className={getCategoryColor(artigo.post_categories[0].categories.name)}>
                            {artigo.post_categories[0].categories.name}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {artigo.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {artigo.source_name && (
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {artigo.source_name}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(artigo.created_at)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button asChild className="flex-1">
                          <Link to={`/artigos/${artigo.id}`}>
                            Ler Artigo
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
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
      {regularArticles.length > 0 && (
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
                      {artigo.post_categories[0] && (
                        <Badge className={getCategoryColor(artigo.post_categories[0].categories.name)}>
                          {artigo.post_categories[0].categories.name}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                      {artigo.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                      {artigo.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                      {artigo.source_name && (
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {artigo.source_name}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(artigo.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/artigos/${artigo.id}`}>
                          Ler Artigo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {artigos.length === 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 text-lg">
              Nenhum artigo disponível no momento.
            </p>
          </div>
        </section>
      )}

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
