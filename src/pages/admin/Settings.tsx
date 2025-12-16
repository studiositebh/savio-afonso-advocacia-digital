import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface Phone {
  number: string;
  type: 'phone' | 'whatsapp';
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  maps_url: string;
}

interface SocialLinks {
  instagram: string;
  linkedin: string;
  facebook: string;
}

interface SiteSettings {
  id: number;
  brand_name: string;
  logo_url: string | null;
  primary_email: string | null;
  phones: Phone[];
  address: Address;
  whatsapp_url: string | null;
  working_hours: string | null;
  footer_text: string | null;
  social_links: SocialLinks;
}

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    id: 1,
    brand_name: '',
    logo_url: '',
    primary_email: '',
    phones: [],
    address: { street: '', city: '', state: '', zip: '', maps_url: '' },
    whatsapp_url: '',
    working_hours: '',
    footer_text: '',
    social_links: { instagram: '', linkedin: '', facebook: '' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings({
          ...data,
          phones: (data.phones as unknown as Phone[]) || [],
          address: (data.address as unknown as Address) || { street: '', city: '', state: '', zip: '', maps_url: '' },
          social_links: (data.social_links as unknown as SocialLinks) || { instagram: '', linkedin: '', facebook: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          brand_name: settings.brand_name,
          logo_url: settings.logo_url || null,
          primary_email: settings.primary_email || null,
          phones: settings.phones as unknown as Record<string, unknown>[],
          address: settings.address as unknown as Record<string, unknown>,
          whatsapp_url: settings.whatsapp_url || null,
          working_hours: settings.working_hours || null,
          footer_text: settings.footer_text || null,
          social_links: settings.social_links as unknown as Record<string, unknown>,
          updated_by: user?.id
        })
        .eq('id', 1);
      
      if (error) throw error;
      toast.success('Configurações salvas!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const addPhone = () => {
    setSettings({
      ...settings,
      phones: [...settings.phones, { number: '', type: 'phone' }]
    });
  };

  const removePhone = (index: number) => {
    const newPhones = settings.phones.filter((_, i) => i !== index);
    setSettings({ ...settings, phones: newPhones });
  };

  const updatePhone = (index: number, field: keyof Phone, value: string) => {
    const newPhones = [...settings.phones];
    newPhones[index] = { ...newPhones[index], [field]: value };
    setSettings({ ...settings, phones: newPhones });
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
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as informações gerais do site
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Identidade */}
        <Card>
          <CardHeader>
            <CardTitle>Identidade</CardTitle>
            <CardDescription>Nome e logo do escritório</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_name">Nome do Escritório</Label>
                <Input
                  id="brand_name"
                  value={settings.brand_name}
                  onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                  placeholder="Ex: Sávio Afonso de Oliveira Advogados"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL do Logo</Label>
                <Input
                  id="logo_url"
                  value={settings.logo_url || ''}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>Email, telefones e WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_email">Email Principal</Label>
                <Input
                  id="primary_email"
                  type="email"
                  value={settings.primary_email || ''}
                  onChange={(e) => setSettings({ ...settings, primary_email: e.target.value })}
                  placeholder="contato@exemplo.com.br"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_url">Link WhatsApp</Label>
                <Input
                  id="whatsapp_url"
                  value={settings.whatsapp_url || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_url: e.target.value })}
                  placeholder="https://wa.me/5531999999999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Telefones</Label>
                <Button variant="outline" size="sm" onClick={addPhone}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              {settings.phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={phone.number}
                    onChange={(e) => updatePhone(index, 'number', e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="flex-1"
                  />
                  <select
                    value={phone.type}
                    onChange={(e) => updatePhone(index, 'type', e.target.value as 'phone' | 'whatsapp')}
                    className="h-10 px-3 border rounded-md"
                  >
                    <option value="phone">Telefone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhone(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="working_hours">Horário de Atendimento</Label>
              <Input
                id="working_hours"
                value={settings.working_hours || ''}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                placeholder="Segunda a Sexta, 9h às 18h"
              />
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Localização do escritório</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Logradouro</Label>
              <Input
                id="street"
                value={settings.address.street}
                onChange={(e) => setSettings({
                  ...settings,
                  address: { ...settings.address, street: e.target.value }
                })}
                placeholder="Av. Santos Dumont, 2626 - Sala 2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={settings.address.city}
                  onChange={(e) => setSettings({
                    ...settings,
                    address: { ...settings.address, city: e.target.value }
                  })}
                  placeholder="Uberaba"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={settings.address.state}
                  onChange={(e) => setSettings({
                    ...settings,
                    address: { ...settings.address, state: e.target.value }
                  })}
                  placeholder="MG"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">CEP</Label>
                <Input
                  id="zip"
                  value={settings.address.zip}
                  onChange={(e) => setSettings({
                    ...settings,
                    address: { ...settings.address, zip: e.target.value }
                  })}
                  placeholder="38050-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maps_url">Link Google Maps</Label>
              <Input
                id="maps_url"
                value={settings.address.maps_url}
                onChange={(e) => setSettings({
                  ...settings,
                  address: { ...settings.address, maps_url: e.target.value }
                })}
                placeholder="https://www.google.com/maps/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Links das redes sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.social_links.instagram}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.social_links.linkedin}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social_links.facebook}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <Card>
          <CardHeader>
            <CardTitle>Rodapé</CardTitle>
            <CardDescription>Texto do rodapé do site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="footer_text">Texto do Copyright</Label>
              <Textarea
                id="footer_text"
                value={settings.footer_text || ''}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                placeholder="© 2025 Nome do Escritório. Todos os direitos reservados."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
