import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Noticia {
  id: string;
  title: string;
  description: string;
  source_name: string;
  source_url: string;
  created_at: string;
  featured_image?: string;
  post_categories: {
    categories: {
      name: string;
    };
  }[];
}

const Noticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          source_name,
          source_url,
          created_at,
          featured_image,
          post_categories (
            categories (
              name
            )
          )
        `)
        .eq('type', 'news')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNoticias(data || []);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

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
            {noticias.length > 0 ? (
              noticias.map((noticia) => (
                <Card key={noticia.id} className="hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                     {noticia.featured_image && (
                       <Link to={`/noticias/${noticia.id}`}>
                         <img
                           src={noticia.featured_image}
                           alt={noticia.title}
                           className="w-full h-48 object-cover rounded-md mb-4 hover:opacity-90 transition-opacity cursor-pointer"
                         />
                       </Link>
                     )}
                    
                    <div className="flex items-center justify-between mb-3">
                      {noticia.post_categories[0] && (
                        <Badge className={getCategoryColor(noticia.post_categories[0].categories.name)}>
                          {noticia.post_categories[0].categories.name}
                        </Badge>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(noticia.created_at)}
                      </div>
                    </div>
                    
                     <Link 
                       to={`/noticias/${noticia.id}`}
                       className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 hover:text-primary transition-colors cursor-pointer block"
                     >
                       {noticia.title}
                     </Link>
                    
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                      {noticia.description}
                    </p>
                    
                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                       <span className="text-sm text-gray-500">
                         {noticia.source_name && `Fonte: ${noticia.source_name}`}
                       </span>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="text-primary hover:text-primary/80"
                         asChild
                       >
                         <Link to={`/noticias/${noticia.id}`}>
                           <ArrowRight className="h-4 w-4 mr-1" />
                           Saiba mais
                         </Link>
                       </Button>
                     </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma notícia publicada ainda.</p>
              </div>
            )}
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