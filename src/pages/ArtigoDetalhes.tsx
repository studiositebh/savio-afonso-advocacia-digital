import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Artigo {
  id: string;
  title: string;
  description: string;
  content: string;
  source_name: string;
  created_at: string;
  featured_image?: string;
  post_categories: {
    categories: {
      name: string;
    };
  }[];
}

const ArtigoDetalhes = () => {
  const { id } = useParams();
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArtigo(id);
    }
  }, [id]);

  const fetchArtigo = async (artigoId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          content,
          source_name,
          created_at,
          featured_image,
          post_categories (
            categories (
              name
            )
          )
        `)
        .eq('id', artigoId)
        .eq('type', 'article')
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setArtigo(data);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
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

  if (!artigo) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Artigo não encontrado</h1>
          <Button asChild>
            <Link to="/artigos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Artigos
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
            <Link to="/artigos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Artigos
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
              {artigo.featured_image && (
                <img
                  src={artigo.featured_image}
                  alt={artigo.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
                />
              )}

              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {artigo.post_categories[0] && (
                    <Badge className={getCategoryColor(artigo.post_categories[0].categories.name)}>
                      {artigo.post_categories[0].categories.name}
                    </Badge>
                  )}
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(artigo.created_at)}
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {artigo.title}
                </h1>

                {artigo.description && (
                  <p className="text-xl text-gray-600 leading-relaxed mb-4">
                    {artigo.description}
                  </p>
                )}

                {artigo.source_name && (
                  <div className="flex items-center text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    <span>Por {artigo.source_name}</span>
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {artigo.content ? (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: artigo.content }}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {artigo.description}
                  </p>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Mais Artigos Jurídicos
            </h2>
            <Button asChild size="lg">
              <Link to="/artigos">
                Ver Todos os Artigos
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtigoDetalhes;
