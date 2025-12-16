import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { generateSlug } from '@/utils/slug';

interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  detailed_description: string | null;
  image_url: string | null;
  icon: string | null;
  active: boolean;
  sort_order: number;
}

export default function PracticeAreas() {
  const { user } = useAuth();
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<PracticeArea | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    detailed_description: '',
    image_url: '',
    icon: '',
    active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('practice_areas')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching practice areas:', error);
      toast.error('Erro ao carregar áreas de atuação');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingArea ? formData.slug : generateSlug(title)
    });
  };

  const openCreateDialog = () => {
    setEditingArea(null);
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      detailed_description: '',
      image_url: '',
      icon: '',
      active: true,
      sort_order: areas.length
    });
    setDialogOpen(true);
  };

  const openEditDialog = (area: PracticeArea) => {
    setEditingArea(area);
    setFormData({
      title: area.title,
      slug: area.slug,
      short_description: area.short_description || '',
      detailed_description: area.detailed_description || '',
      image_url: area.image_url || '',
      icon: area.icon || '',
      active: area.active,
      sort_order: area.sort_order
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error('Título e slug são obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description || null,
        detailed_description: formData.detailed_description || null,
        image_url: formData.image_url || null,
        icon: formData.icon || null,
        active: formData.active,
        sort_order: formData.sort_order,
        updated_by: user?.id
      };

      if (editingArea) {
        const { error } = await supabase
          .from('practice_areas')
          .update(dataToSave)
          .eq('id', editingArea.id);
        
        if (error) throw error;
        toast.success('Área atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('practice_areas')
          .insert(dataToSave);
        
        if (error) throw error;
        toast.success('Área criada com sucesso!');
      }

      setDialogOpen(false);
      fetchAreas();
    } catch (error: any) {
      console.error('Error saving practice area:', error);
      if (error.code === '23505') {
        toast.error('Já existe uma área com este slug');
      } else {
        toast.error('Erro ao salvar área');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta área?')) return;

    try {
      const { error } = await supabase
        .from('practice_areas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Área excluída com sucesso!');
      fetchAreas();
    } catch (error) {
      console.error('Error deleting practice area:', error);
      toast.error('Erro ao excluir área');
    }
  };

  const toggleActive = async (area: PracticeArea) => {
    try {
      const { error } = await supabase
        .from('practice_areas')
        .update({ active: !area.active, updated_by: user?.id })
        .eq('id', area.id);
      
      if (error) throw error;
      toast.success(area.active ? 'Área desativada' : 'Área ativada');
      fetchAreas();
    } catch (error) {
      console.error('Error toggling area:', error);
      toast.error('Erro ao alterar status');
    }
  };

  const moveArea = async (index: number, direction: 'up' | 'down') => {
    const newAreas = [...areas];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= areas.length) return;
    
    [newAreas[index], newAreas[newIndex]] = [newAreas[newIndex], newAreas[index]];
    
    try {
      await Promise.all(
        newAreas.map((area, idx) =>
          supabase
            .from('practice_areas')
            .update({ sort_order: idx })
            .eq('id', area.id)
        )
      );
      
      setAreas(newAreas);
      toast.success('Ordem atualizada');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Erro ao reordenar');
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Áreas de Atuação</h1>
          <p className="text-muted-foreground">
            Gerencie as áreas de atuação do escritório
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Área
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArea ? 'Editar Área' : 'Nova Área de Atuação'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da área de atuação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Direito Empresarial"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="direito-empresarial"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Descrição Curta</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Breve descrição para listagem"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detailed_description">Descrição Detalhada</Label>
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  placeholder="Descrição completa da área"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone (nome do Lucide)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Ex: Scale, Building2, Users"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Ativa (visível no site)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingArea ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-32 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area, index) => (
                <TableRow key={area.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveArea(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveArea(index, 'down')}
                        disabled={index === areas.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{area.title}</TableCell>
                  <TableCell className="text-muted-foreground">{area.slug}</TableCell>
                  <TableCell>
                    <Badge
                      variant={area.active ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleActive(area)}
                    >
                      {area.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(area)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(area.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {areas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma área de atuação cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
