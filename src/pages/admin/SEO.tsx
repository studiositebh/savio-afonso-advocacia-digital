import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Save, Loader2, Globe } from 'lucide-react';

interface SEOData {
  meta_title: string;
  meta_description: string;
  og_image: string;
  canonical_url: string;
  noindex: boolean;
}

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  body_richtext: string | null;
  seo: SEOData;
  status: string;
}

export default function SEO() {
  const { user } = useAuth();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [seoData, setSeoData] = useState<Record<string, SEOData>>({});

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('page_key');
      
      if (error) throw error;
      
      setPages((data || []) as unknown as PageContent[]);
      
      // Initialize SEO data for each page
      const initialSeoData: Record<string, SEOData> = {};
      data?.forEach(page => {
        const seo = page.seo as Record<string, unknown> | null;
        initialSeoData[page.page_key] = {
          meta_title: (seo?.meta_title as string) || '',
          meta_description: (seo?.meta_description as string) || '',
          og_image: (seo?.og_image as string) || '',
          canonical_url: (seo?.canonical_url as string) || '',
          noindex: (seo?.noindex as boolean) || false
        };
      });
      setSeoData(initialSeoData);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Erro ao carregar páginas');
    } finally {
      setLoading(false);
    }
  };

  const saveSEO = async (pageKey: string) => {
    setSaving(true);
    try {
      const page = pages.find(p => p.page_key === pageKey);
      if (!page) return;

      const { error } = await supabase
        .from('page_contents')
        .update({
          seo: seoData[pageKey] as any,
          updated_by: user?.id
        })
        .eq('id', page.id);
      
      if (error) throw error;
      toast.success('SEO atualizado!');
    } catch (error) {
      console.error('Error saving SEO:', error);
      toast.error('Erro ao salvar SEO');
    } finally {
      setSaving(false);
    }
  };

  const updateSEO = (pageKey: string, field: keyof SEOData, value: string | boolean) => {
    setSeoData({
      ...seoData,
      [pageKey]: {
        ...seoData[pageKey],
        [field]: value
      }
    });
  };

  const getPageLabel = (key: string): string => {
    const labels: Record<string, string> = {
      home: 'Página Inicial',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Uso',
      about: 'Sobre',
      areas: 'Áreas de Atuação',
      contact: 'Contato'
    };
    return labels[key] || key;
  };

  const getTitleLength = (title: string): { count: number; status: 'ok' | 'warning' | 'error' } => {
    const count = title.length;
    if (count === 0) return { count, status: 'warning' };
    if (count <= 60) return { count, status: 'ok' };
    return { count, status: 'error' };
  };

  const getDescriptionLength = (desc: string): { count: number; status: 'ok' | 'warning' | 'error' } => {
    const count = desc.length;
    if (count === 0) return { count, status: 'warning' };
    if (count <= 160) return { count, status: 'ok' };
    return { count, status: 'error' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO</h1>
        <p className="text-muted-foreground">
          Configure as meta tags e informações de SEO de cada página
        </p>
      </div>

      <Tabs value={currentPage} onValueChange={setCurrentPage} className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          {pages.map(page => (
            <TabsTrigger key={page.page_key} value={page.page_key}>
              <Globe className="mr-2 h-4 w-4" />
              {getPageLabel(page.page_key)}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map(page => {
          const data = seoData[page.page_key] || {
            meta_title: '',
            meta_description: '',
            og_image: '',
            canonical_url: '',
            noindex: false
          };
          const titleInfo = getTitleLength(data.meta_title);
          const descInfo = getDescriptionLength(data.meta_description);

          return (
            <TabsContent key={page.page_key} value={page.page_key}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>SEO - {getPageLabel(page.page_key)}</span>
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                      {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Configure as informações de SEO para melhorar o posicionamento nos buscadores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Meta Title */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`title-${page.page_key}`}>Meta Title</Label>
                      <Badge variant={titleInfo.status === 'ok' ? 'default' : titleInfo.status === 'warning' ? 'secondary' : 'destructive'}>
                        {titleInfo.count}/60 caracteres
                      </Badge>
                    </div>
                    <Input
                      id={`title-${page.page_key}`}
                      value={data.meta_title}
                      onChange={(e) => updateSEO(page.page_key, 'meta_title', e.target.value)}
                      placeholder="Título da página para os buscadores"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recomendado: até 60 caracteres. Inclua palavras-chave relevantes.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`desc-${page.page_key}`}>Meta Description</Label>
                      <Badge variant={descInfo.status === 'ok' ? 'default' : descInfo.status === 'warning' ? 'secondary' : 'destructive'}>
                        {descInfo.count}/160 caracteres
                      </Badge>
                    </div>
                    <Textarea
                      id={`desc-${page.page_key}`}
                      value={data.meta_description}
                      onChange={(e) => updateSEO(page.page_key, 'meta_description', e.target.value)}
                      placeholder="Descrição da página para os resultados de busca"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recomendado: até 160 caracteres. Descreva o conteúdo da página de forma atrativa.
                    </p>
                  </div>

                  {/* OG Image */}
                  <div className="space-y-2">
                    <Label htmlFor={`og-${page.page_key}`}>Imagem de Compartilhamento (OG Image)</Label>
                    <Input
                      id={`og-${page.page_key}`}
                      value={data.og_image}
                      onChange={(e) => updateSEO(page.page_key, 'og_image', e.target.value)}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Imagem exibida ao compartilhar nas redes sociais. Recomendado: 1200x630px.
                    </p>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-2">
                    <Label htmlFor={`canonical-${page.page_key}`}>URL Canônica (opcional)</Label>
                    <Input
                      id={`canonical-${page.page_key}`}
                      value={data.canonical_url}
                      onChange={(e) => updateSEO(page.page_key, 'canonical_url', e.target.value)}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Use apenas se houver conteúdo duplicado em outras URLs.
                    </p>
                  </div>

                  {/* noindex */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor={`noindex-${page.page_key}`}>Bloquear indexação</Label>
                      <p className="text-sm text-muted-foreground">
                        Impede que os buscadores indexem esta página
                      </p>
                    </div>
                    <Switch
                      id={`noindex-${page.page_key}`}
                      checked={data.noindex}
                      onCheckedChange={(checked) => updateSEO(page.page_key, 'noindex', checked)}
                    />
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <Label className="text-xs text-muted-foreground">Preview no Google:</Label>
                    <div className="font-medium text-blue-600 hover:underline cursor-pointer">
                      {data.meta_title || 'Título da página'}
                    </div>
                    <div className="text-sm text-green-700">
                      savioadv.com.br/{page.page_key === 'home' ? '' : page.page_key}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.meta_description || 'Descrição da página aparece aqui...'}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => saveSEO(page.page_key)} disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Salvar SEO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
