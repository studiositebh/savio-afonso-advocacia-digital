import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, User, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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
  const [downloading, setDownloading] = useState(false);

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

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const downloadPDF = async () => {
    if (!artigo) return;
    
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Header with brand
      doc.setFontSize(10);
      doc.setTextColor(139, 115, 85); // Primary gold color
      doc.text('Sávio Afonso de Oliveira - Advocacia Empresarial', margin, yPosition);
      yPosition += 15;

      // Category
      if (artigo.post_categories[0]) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(artigo.post_categories[0].categories.name.toUpperCase(), margin, yPosition);
        yPosition += 10;
      }

      // Title
      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      const titleLines = doc.splitTextToSize(artigo.title, maxWidth);
      doc.text(titleLines, margin, yPosition);
      yPosition += (titleLines.length * 8) + 10;

      // Description
      if (artigo.description) {
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        const descLines = doc.splitTextToSize(artigo.description, maxWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += (descLines.length * 6) + 10;
      }

      // Meta info (author and date)
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      const metaText = `${artigo.source_name ? `Por ${artigo.source_name} | ` : ''}${formatDate(artigo.created_at)}`;
      doc.text(metaText, margin, yPosition);
      yPosition += 15;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Content
      const plainContent = stripHtml(artigo.content || artigo.description);
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      
      const contentLines = doc.splitTextToSize(plainContent, maxWidth);
      
      for (let i = 0; i < contentLines.length; i++) {
        if (yPosition > pageHeight - margin - 20) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(contentLines[i], margin, yPosition);
        yPosition += 6;
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${totalPages} | www.savioadv.com.br`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Generate filename
      const fileName = artigo.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 50);

      doc.save(`${fileName}.pdf`);
      toast.success('PDF baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setDownloading(false);
    }
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
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link to="/artigos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Artigos
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadPDF}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {downloading ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </div>
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
