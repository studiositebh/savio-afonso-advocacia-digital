import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAISubscription } from '@/hooks/useAISubscription';
import { AIPlansModal } from '@/components/admin/AIPlansModal';
import { ArrowLeft, Sparkles, RefreshCw, Save, Send, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface GeneratedContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  content: string;
  faqs: Array<{ question: string; answer: string }>;
}

export default function AIPostWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasActiveSubscription, getCreditsRemaining, canPublish, consumeCredit, refreshData } = useAISubscription();
  const quillRef = useRef<ReactQuill>(null);

  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [plansModalReason, setPlansModalReason] = useState<'no_subscription' | 'no_credits'>('no_subscription');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Form data
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [region, setRegion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('profissional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [cta, setCta] = useState('');

  // Generated content
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedMetaTitle, setEditedMetaTitle] = useState('');
  const [editedMetaDescription, setEditedMetaDescription] = useState('');
  const [editedSlug, setEditedSlug] = useState('');

  // Quill modules
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      [{ 'align': [] }],
      ['clean']
    ]
  }), []);

  useEffect(() => {
    // Verificar assinatura ao carregar
    if (!hasActiveSubscription()) {
      setPlansModalReason('no_subscription');
      setShowPlansModal(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Tema obrigatório",
        description: "Por favor, informe o tema da notícia.",
        variant: "destructive",
      });
      return;
    }

    if (!disclaimerAccepted) {
      toast({
        title: "Aceite o disclaimer",
        description: "Você precisa confirmar que o conteúdo é informativo.",
        variant: "destructive",
      });
      return;
    }

    if (!hasActiveSubscription()) {
      setPlansModalReason('no_subscription');
      setShowPlansModal(true);
      return;
    }

    setGenerating(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ai-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token}`,
        },
        body: JSON.stringify({
          topic,
          targetAudience,
          region,
          keywords,
          tone,
          length,
          cta,
          generationId: generationId || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'NO_SUBSCRIPTION') {
          setPlansModalReason('no_subscription');
          setShowPlansModal(true);
          return;
        }
        if (result.code === 'REGEN_LIMIT') {
          toast({
            title: "Limite de regenerações",
            description: "Você atingiu o limite de 5 regenerações para este post.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(result.error || 'Erro ao gerar conteúdo');
      }

      setGeneratedContent(result.data);
      setEditedTitle(result.data.title);
      setEditedContent(result.data.content);
      setEditedMetaTitle(result.data.metaTitle);
      setEditedMetaDescription(result.data.metaDescription);
      setEditedSlug(result.data.slug);
      setGenerationId(result.generationId);
      
      if (generationId) {
        setRegenerationCount(prev => prev + 1);
      }
      
      setStep('preview');

      toast({
        title: "Conteúdo gerado!",
        description: "Revise e edite o conteúdo antes de publicar.",
      });

    } catch (error: any) {
      console.error('Generate error:', error);
      toast({
        title: "Erro ao gerar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (regenerationCount >= 5) {
      toast({
        title: "Limite atingido",
        description: "Você já regenerou este post 5 vezes.",
        variant: "destructive",
      });
      return;
    }
    handleGenerate();
  };

  const handleSaveDraft = async () => {
    if (!user || !generatedContent) return;
    
    setSaving(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          title: editedTitle,
          slug: editedSlug,
          description: editedMetaDescription,
          content: editedContent,
          type: 'news',
          status: 'draft',
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Rascunho salvo!",
        description: "O post foi salvo como rascunho.",
      });

      navigate('/admin/posts?type=news');

    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user || !generatedContent) return;

    if (!canPublish()) {
      setPlansModalReason('no_credits');
      setShowPlansModal(true);
      return;
    }

    setSaving(true);

    try {
      // Consumir crédito
      const consumed = await consumeCredit();
      if (!consumed) {
        throw new Error('Erro ao consumir crédito');
      }

      // Marcar geração como publicada
      if (generationId) {
        await supabase
          .from('ai_generations')
          .update({ published: true })
          .eq('id', generationId);
      }

      // Criar post publicado
      const { error } = await supabase
        .from('posts')
        .insert({
          title: editedTitle,
          slug: editedSlug,
          description: editedMetaDescription,
          content: editedContent,
          type: 'news',
          status: 'published',
          user_id: user.id,
        });

      if (error) throw error;

      refreshData();

      toast({
        title: "Publicado com sucesso!",
        description: "O post foi publicado e um crédito foi consumido.",
      });

      navigate('/admin/posts?type=news');

    } catch (error: any) {
      toast({
        title: "Erro ao publicar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/posts?type=news')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              Nova Notícia com IA
            </h1>
            <p className="text-muted-foreground">
              {step === 'form' ? 'Configure os parâmetros para gerar o conteúdo' : 'Revise e edite o conteúdo gerado'}
            </p>
          </div>
        </div>
        {hasActiveSubscription() && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Créditos restantes</p>
            <p className="text-2xl font-bold text-primary">{getCreditsRemaining()}</p>
          </div>
        )}
      </div>

      {step === 'form' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Conteúdo</CardTitle>
                <CardDescription>
                  Preencha os campos para personalizar o conteúdo gerado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Tema *</Label>
                  <Textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Reforma Tributária e impactos para empresas do Simples Nacional"
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Público-alvo</Label>
                    <Input
                      id="targetAudience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Ex: empresários, contadores"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Cidade/Região (SEO local)</Label>
                    <Input
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Ex: Belo Horizonte, Minas Gerais"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Palavras-chave principais</Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ex: reforma tributária, IBS, CBS, impacto empresas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta">CTA final (opcional)</Label>
                  <Input
                    id="cta"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="Ex: Agende uma conversa com nossos especialistas"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tom</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profissional">Profissional e claro</SelectItem>
                        <SelectItem value="didatico">Didático e acessível</SelectItem>
                        <SelectItem value="tecnico">Técnico e aprofundado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tamanho</Label>
                    <Select value={length} onValueChange={(v) => setLength(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Curto (800-1000 palavras)</SelectItem>
                        <SelectItem value="medium">Médio (1200-1500 palavras)</SelectItem>
                        <SelectItem value="long">Longo (1800-2200 palavras)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={(checked) => setDisclaimerAccepted(checked as boolean)}
                  />
                  <Label htmlFor="disclaimer" className="text-sm leading-relaxed cursor-pointer">
                    Confirmo que este conteúdo é meramente informativo e não substitui consultoria jurídica individualizada.
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerar Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleGenerate}
                  disabled={generating || !topic.trim() || !disclaimerAccepted}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gerar rascunho
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  O crédito só é consumido ao publicar
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">O que será gerado:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ Título otimizado para SEO</p>
                <p>✓ Meta title e description</p>
                <p>✓ Slug amigável</p>
                <p>✓ Conteúdo estruturado com H2/H3</p>
                <p>✓ Seção de FAQs (3-6 perguntas)</p>
                <p>✓ Conclusão com CTA</p>
                <p>✓ Disclaimer jurídico</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Título e SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editedTitle">Título (H1)</Label>
                  <Input
                    id="editedTitle"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editedSlug">Slug</Label>
                  <Input
                    id="editedSlug"
                    value={editedSlug}
                    onChange={(e) => setEditedSlug(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editedMetaTitle">
                    Meta Title ({editedMetaTitle.length}/60)
                  </Label>
                  <Input
                    id="editedMetaTitle"
                    value={editedMetaTitle}
                    onChange={(e) => setEditedMetaTitle(e.target.value)}
                    maxLength={70}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editedMetaDescription">
                    Meta Description ({editedMetaDescription.length}/155)
                  </Label>
                  <Textarea
                    id="editedMetaDescription"
                    value={editedMetaDescription}
                    onChange={(e) => setEditedMetaDescription(e.target.value)}
                    maxLength={165}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={editedContent}
                  onChange={setEditedContent}
                  modules={modules}
                  style={{ height: '400px', marginBottom: '50px' }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRegenerate}
                  disabled={generating || regenerationCount >= 5}
                >
                  {generating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Gerar novamente ({5 - regenerationCount} restantes)
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar rascunho
                </Button>

                <Button
                  className="w-full"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Publicar (1 crédito)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Créditos restantes: {getCreditsRemaining()}
                </p>
              </CardContent>
            </Card>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep('form')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para configuração
            </Button>
          </div>
        </div>
      )}

      <AIPlansModal
        open={showPlansModal}
        onOpenChange={setShowPlansModal}
        reason={plansModalReason}
      />
    </div>
  );
}
