import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateSlug } from '@/utils/slug';
import { Save, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Category {
  id: string;
  name: string;
}

interface PostFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  type: 'news' | 'article';
  status: 'draft' | 'published';
  featured_image: string;
  source_name: string;
  source_url: string;
}

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    type: (searchParams.get('type') as 'news' | 'article') || 'news',
    status: 'draft',
    featured_image: '',
    source_name: '',
    source_url: '',
  });

  const isEdit = !!id;
  const title = isEdit ? 'Editar Post' : 'Novo Post';

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    setCategories(data || []);
  };

  const fetchPost = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_categories (
          category_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: "Erro ao carregar post",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        content: data.content || '',
        type: (data.type as 'news' | 'article') || 'news',
        status: (data.status as 'draft' | 'published') || 'draft',
        featured_image: data.featured_image || '',
        source_name: data.source_name || '',
        source_url: data.source_url || '',
      });

      setSelectedCategories(
        data.post_categories?.map((pc: any) => pc.category_id) || []
      );
    }
  };

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !isEdit ? { slug: generateSlug(value) } : {})
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      const postId = result.data.id;

      // Update categories
      await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', postId);

      if (selectedCategories.length > 0) {
        const categoryData = selectedCategories.map(categoryId => ({
          post_id: postId,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(categoryData);

        if (categoryError) throw categoryError;
      }

      toast({
        title: `Post ${isEdit ? 'atualizado' : 'criado'} com sucesso!`,
      });

      navigate(`/admin/posts?type=${formData.type}`);
    } catch (error: any) {
      toast({
        title: `Erro ao ${isEdit ? 'atualizar' : 'criar'} post`,
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Breve descrição do post"
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
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source_name">Nome da Fonte</Label>
                  <Input
                    id="source_name"
                    value={formData.source_name}
                    onChange={(e) => handleInputChange('source_name', e.target.value)}
                    placeholder="Ex: Portal de Notícias"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source_url">URL da Fonte</Label>
                  <Input
                    id="source_url"
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => handleInputChange('source_url', e.target.value)}
                    placeholder="https://exemplo.com/noticia"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: 'news' | 'article') => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">Notícia</SelectItem>
                      <SelectItem value="article">Artigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'} Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagem Destaque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">URL da Imagem</Label>
                  <Input
                    id="featured_image"
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => handleInputChange('featured_image', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                {formData.featured_image && (
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}