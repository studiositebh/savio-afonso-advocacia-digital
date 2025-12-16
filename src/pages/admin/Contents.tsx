import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Save, Eye, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface HomeSection {
  id: string;
  section_key: string;
  content: Record<string, any>;
  status: string;
  updated_at: string;
}

export default function Contents() {
  const { user } = useAuth();
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroContent, setHeroContent] = useState({
    headline: '',
    subheadline: '',
    button_text: '',
    button_link: '',
    background_image: ''
  });
  const [aboutContent, setAboutContent] = useState({
    title: '',
    text: '',
    highlight_number: '',
    highlight_label: '',
    image: ''
  });
  const [contactCtaContent, setContactCtaContent] = useState({
    title: '',
    text: '',
    button_text: ''
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .order('section_key');
      
      if (error) throw error;
      
      setSections((data || []) as HomeSection[]);
      
      // Populate form states
      data?.forEach(section => {
        const content = section.content as Record<string, any>;
        if (section.section_key === 'hero') {
          setHeroContent({
            headline: content.headline || '',
            subheadline: content.subheadline || '',
            button_text: content.button_text || '',
            button_link: content.button_link || '',
            background_image: content.background_image || ''
          });
        } else if (section.section_key === 'about') {
          setAboutContent({
            title: content.title || '',
            text: content.text || '',
            highlight_number: content.highlight_number || '',
            highlight_label: content.highlight_label || '',
            image: content.image || ''
          });
        } else if (section.section_key === 'contact_cta') {
          setContactCtaContent({
            title: content.title || '',
            text: content.text || '',
            button_text: content.button_text || ''
          });
        }
      });
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Erro ao carregar seções');
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionKey: string, content: Record<string, any>, publish: boolean = false) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('home_sections')
        .update({
          content,
          status: publish ? 'published' : 'draft',
          updated_by: user?.id
        })
        .eq('section_key', sectionKey);
      
      if (error) throw error;
      
      toast.success(publish ? 'Seção publicada!' : 'Rascunho salvo!');
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Erro ao salvar seção');
    } finally {
      setSaving(false);
    }
  };

  const getSectionStatus = (sectionKey: string) => {
    const section = sections.find(s => s.section_key === sectionKey);
    return section?.status || 'draft';
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
        <h1 className="text-3xl font-bold">Conteúdos do Site</h1>
        <p className="text-muted-foreground">
          Edite as seções da página inicial
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">
            Hero / Topo
            <Badge variant={getSectionStatus('hero') === 'published' ? 'default' : 'secondary'} className="ml-2">
              {getSectionStatus('hero') === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="about">
            Sobre
            <Badge variant={getSectionStatus('about') === 'published' ? 'default' : 'secondary'} className="ml-2">
              {getSectionStatus('about') === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="contact_cta">
            CTA Contato
            <Badge variant={getSectionStatus('contact_cta') === 'published' ? 'default' : 'secondary'} className="ml-2">
              {getSectionStatus('contact_cta') === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero / Topo</CardTitle>
              <CardDescription>Configure o banner principal do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-headline">Título Principal</Label>
                <Input
                  id="hero-headline"
                  value={heroContent.headline}
                  onChange={(e) => setHeroContent({ ...heroContent, headline: e.target.value })}
                  placeholder="Ex: Sávio Afonso de Oliveira Advogados"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subheadline">Subtítulo</Label>
                <Textarea
                  id="hero-subheadline"
                  value={heroContent.subheadline}
                  onChange={(e) => setHeroContent({ ...heroContent, subheadline: e.target.value })}
                  placeholder="Descrição breve do escritório"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-button-text">Texto do Botão</Label>
                  <Input
                    id="hero-button-text"
                    value={heroContent.button_text}
                    onChange={(e) => setHeroContent({ ...heroContent, button_text: e.target.value })}
                    placeholder="Ex: Fale Conosco"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-button-link">Link do Botão</Label>
                  <Input
                    id="hero-button-link"
                    value={heroContent.button_link}
                    onChange={(e) => setHeroContent({ ...heroContent, button_link: e.target.value })}
                    placeholder="Ex: /contato"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-bg">URL da Imagem de Fundo</Label>
                <Input
                  id="hero-bg"
                  value={heroContent.background_image}
                  onChange={(e) => setHeroContent({ ...heroContent, background_image: e.target.value })}
                  placeholder="URL da imagem"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => saveSection('hero', heroContent, false)}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={() => saveSection('hero', heroContent, true)}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Eye className="mr-2 h-4 w-4" />
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Seção Sobre o Escritório</CardTitle>
              <CardDescription>Configure a seção de apresentação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Título</Label>
                <Input
                  id="about-title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                  placeholder="Ex: Sobre o Escritório"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-text">Texto</Label>
                <Textarea
                  id="about-text"
                  value={aboutContent.text}
                  onChange={(e) => setAboutContent({ ...aboutContent, text: e.target.value })}
                  placeholder="Descrição do escritório"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="about-number">Número em Destaque</Label>
                  <Input
                    id="about-number"
                    value={aboutContent.highlight_number}
                    onChange={(e) => setAboutContent({ ...aboutContent, highlight_number: e.target.value })}
                    placeholder="Ex: 30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-label">Label do Destaque</Label>
                  <Input
                    id="about-label"
                    value={aboutContent.highlight_label}
                    onChange={(e) => setAboutContent({ ...aboutContent, highlight_label: e.target.value })}
                    placeholder="Ex: anos de experiência"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-image">URL da Imagem</Label>
                <Input
                  id="about-image"
                  value={aboutContent.image}
                  onChange={(e) => setAboutContent({ ...aboutContent, image: e.target.value })}
                  placeholder="URL da imagem"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => saveSection('about', aboutContent, false)}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={() => saveSection('about', aboutContent, true)}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Eye className="mr-2 h-4 w-4" />
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact CTA Section */}
        <TabsContent value="contact_cta">
          <Card>
            <CardHeader>
              <CardTitle>Seção CTA de Contato</CardTitle>
              <CardDescription>Configure a chamada para ação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta-title">Título</Label>
                <Input
                  id="cta-title"
                  value={contactCtaContent.title}
                  onChange={(e) => setContactCtaContent({ ...contactCtaContent, title: e.target.value })}
                  placeholder="Ex: Entre em Contato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-text">Texto</Label>
                <Textarea
                  id="cta-text"
                  value={contactCtaContent.text}
                  onChange={(e) => setContactCtaContent({ ...contactCtaContent, text: e.target.value })}
                  placeholder="Texto da chamada"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-button">Texto do Botão</Label>
                <Input
                  id="cta-button"
                  value={contactCtaContent.button_text}
                  onChange={(e) => setContactCtaContent({ ...contactCtaContent, button_text: e.target.value })}
                  placeholder="Ex: Enviar Mensagem"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => saveSection('contact_cta', contactCtaContent, false)}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={() => saveSection('contact_cta', contactCtaContent, true)}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Eye className="mr-2 h-4 w-4" />
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
