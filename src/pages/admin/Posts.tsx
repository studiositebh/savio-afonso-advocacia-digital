import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'news' | 'article';
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function Posts() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const type = searchParams.get('type') as 'news' | 'article' | null;
  const title = type === 'news' ? 'Notícias' : type === 'article' ? 'Artigos' : 'Posts';

  useEffect(() => {
    fetchPosts();
  }, [type, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Erro ao carregar posts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPosts((data as Post[]) || []);
    }
    
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro ao deletar post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post deletado com sucesso",
      });
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            Gerencie {title.toLowerCase()} do site
          </p>
        </div>
        <Link to={`/admin/posts/new${type ? `?type=${type}` : ''}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo {type === 'news' ? 'Notícia' : type === 'article' ? 'Artigo' : 'Post'}
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              Nenhum post encontrado.
            </p>
            <Link to={`/admin/posts/new${type ? `?type=${type}` : ''}`} className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 ml-2">
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                    <Badge variant="outline">
                      {post.type === 'news' ? 'Notícia' : 'Artigo'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex gap-2">
                    <Link to={`/admin/posts/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}