import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Trash2, Shield, Loader2 } from "lucide-react";
import { z } from "zod";

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
}

const emailSchema = z.string().email("Email inválido").min(1, "Email é obrigatório");

export default function AdminUsers() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .in("role", ["admin", "cliente_admin"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar administradores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    try {
      emailSchema.parse(email);
      setEmailError("");
      return true;
    } catch (error: any) {
      setEmailError(error.errors[0].message);
      return false;
    }
  };

  const handleAddAdmin = async () => {
    if (!validateEmail(newEmail)) return;

    setSaving(true);
    try {
      // First, check if user exists by trying to get their ID
      // We need to use an edge function or admin API for this
      // For now, we'll create a placeholder that admin needs to confirm
      
      // Check if email is already an admin
      const { data: existingRoles } = await supabase
        .from("user_roles")
        .select("*")
        .in("role", ["admin", "cliente_admin"]);
      
      // Since we can't directly query auth.users, we'll notify the admin
      // that the user needs to sign up first, then we can add them
      
      toast({
        title: "Instruções",
        description: `Para adicionar ${newEmail} como administrador: 1) O usuário deve criar uma conta primeiro. 2) Após criar a conta, adicione manualmente o role via Supabase Dashboard.`,
      });
      
      setDialogOpen(false);
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar administrador",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async (roleId: string) => {
    if (!confirm("Tem certeza que deseja remover este administrador?")) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast({ title: "Administrador removido com sucesso!" });
      fetchAdmins();
    } catch (error: any) {
      toast({
        title: "Erro ao remover administrador",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários Administradores</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários com acesso ao painel administrativo
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Administrador</DialogTitle>
              <DialogDescription>
                Informe o email do usuário que receberá acesso administrativo.
                O usuário precisa ter uma conta criada no sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(newEmail)}
                />
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>
              <Button
                onClick={handleAddAdmin}
                disabled={saving || !newEmail}
                className="w-full"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administradores Ativos
          </CardTitle>
          <CardDescription>
            Lista de usuários com permissões administrativas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum administrador encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Usuário</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-mono text-sm">
                      {admin.user_id}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {admin.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAdmin(admin.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como adicionar um novo administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. O usuário deve primeiro criar uma conta no sistema através da página de login.</p>
          <p>2. Após o usuário criar a conta, acesse o Supabase Dashboard.</p>
          <p>3. Na tabela <code className="bg-muted px-1 rounded">user_roles</code>, adicione uma nova linha com:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code className="bg-muted px-1 rounded">user_id</code>: ID do usuário (encontrado em Authentication &gt; Users)</li>
            <li><code className="bg-muted px-1 rounded">role</code>: <code className="bg-muted px-1 rounded">cliente_admin</code></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
