import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Noticia {
  id: string;
  title: string;
  description: string;
  content: string;
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

const NoticiaDetalhes = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNoticia(id);
    }
  }, [id]);

  const fetchNoticia = async (noticiaId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          content,
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
        .eq('id', noticiaId)
        .eq('type', 'news')
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setNoticia(data);
    } catch (error) {
      console.error('Erro ao carregar notícia:', error);
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
      month: 'long',
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

  if (!noticia) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Notícia não encontrada</h1>
          <Button asChild>
            <Link to="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Notícias
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Notícias
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article>
              {/* Featured Image */}
              {noticia.featured_image && (
                <img
                  src={noticia.featured_image}
                  alt={noticia.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
                />
              )}

              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {noticia.post_categories[0] && (
                    <Badge className={getCategoryColor(noticia.post_categories[0].categories.name)}>
                      {noticia.post_categories[0].categories.name}
                    </Badge>
                  )}
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(noticia.created_at)}
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {noticia.title}
                </h1>

                {noticia.description && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {noticia.description}
                  </p>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {noticia.content ? (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: noticia.content }}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {noticia.description}
                  </p>
                )}
              </div>

              {/* Source Link */}
              {noticia.source_url && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Fonte Original</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {noticia.source_name || 'Fonte externa'}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(noticia.source_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Acessar fonte
                    </Button>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Mais Notícias Jurídicas
            </h2>
            <Button asChild size="lg">
              <Link to="/noticias">
                Ver Todas as Notícias
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoticiaDetalhes;