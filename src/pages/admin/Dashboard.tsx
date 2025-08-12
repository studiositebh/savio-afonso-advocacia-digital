import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Newspaper, FolderOpen, Image } from 'lucide-react';

interface Stats {
  totalPosts: number;
  totalNews: number;
  totalArticles: number;
  totalCategories: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalNews: 0,
    totalArticles: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [postsResult, newsResult, articlesResult, categoriesResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact' }),
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'news'),
        supabase.from('posts').select('id', { count: 'exact' }).eq('type', 'article'),
        supabase.from('categories').select('id', { count: 'exact' }),
      ]);

      setStats({
        totalPosts: postsResult.count || 0,
        totalNews: newsResult.count || 0,
        totalArticles: articlesResult.count || 0,
        totalCategories: categoriesResult.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do painel administrativo
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Notícias e artigos publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notícias</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
            <p className="text-xs text-muted-foreground">
              Notícias publicadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Artigos publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Categorias criadas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}