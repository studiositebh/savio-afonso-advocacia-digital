import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Imagem" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadImage = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de imagens.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Also save to media table for tracking
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          filename: fileName,
          original_name: file.name,
          file_path: filePath,
          mime_type: file.type,
          file_size: file.size,
          user_id: user.id
        });

      if (dbError) {
        console.warn('Erro ao salvar no banco:', dbError);
      }

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      
      toast({
        title: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem com menos de 5MB.",
        variant: "destructive",
      });
      return;
    }

    uploadImage(file);
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-8">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <span className="text-gray-600">Clique para selecionar uma imagem</span>
                  <span className="text-sm text-gray-400">PNG, JPG até 5MB</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}