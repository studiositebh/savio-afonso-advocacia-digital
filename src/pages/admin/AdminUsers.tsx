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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Shield, Loader2, Key, Users } from "lucide-react";
import { z } from "zod";

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

interface RoleInfo {
  name: string;
  description: string;
}

const emailSchema = z.string().email("Email inválido");
const nameSchema = z.string().min(1, "Nome é obrigatório");
const passwordSchema = z.string().min(6, "Senha deve ter pelo menos 6 caracteres");

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [rolesInfo, setRolesInfo] = useState<Record<string, RoleInfo>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke("admin-users", {
        body: { action: "list" },
      });

      if (response.error) throw response.error;
      setUsers(response.data.users || []);
      setRolesInfo(response.data.rolesInfo || {});
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEditForm = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    try {
      nameSchema.parse(editForm.name);
    } catch (e: any) {
      newErrors.name = e.errors[0].message;
      isValid = false;
    }

    try {
      emailSchema.parse(editForm.email);
    } catch (e: any) {
      newErrors.email = e.errors[0].message;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = () => {
    try {
      passwordSchema.parse(newPassword);
      setErrors(prev => ({ ...prev, password: "" }));
      return true;
    } catch (e: any) {
      setErrors(prev => ({ ...prev, password: e.errors[0].message }));
      return false;
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email });
    setErrors({ name: "", email: "", password: "" });
    setEditDialogOpen(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setErrors({ name: "", email: "", password: "" });
    setPasswordDialogOpen(true);
  };

  const openRolesDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles([...user.roles]);
    setRolesDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateEditForm() || !selectedUser) return;

    setSaving(true);
    try {
      const response = await supabase.functions.invoke("admin-users", {
        body: {
          action: "update",
          userId: selectedUser.id,
          name: editForm.name,
          email: editForm.email,
        },
      });

      if (response.error) throw response.error;

      toast({ title: "Usuário atualizado com sucesso!" });
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePassword() || !selectedUser) return;

    setSaving(true);
    try {
      const response = await supabase.functions.invoke("admin-users", {
        body: {
          action: "updatePassword",
          userId: selectedUser.id,
          password: newPassword,
        },
      });

      if (response.error) throw response.error;

      toast({ title: "Senha alterada com sucesso!" });
      setPasswordDialogOpen(false);
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRolesChange = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      const response = await supabase.functions.invoke("admin-users", {
        body: {
          action: "setRoles",
          userId: selectedUser.id,
          newRoles: selectedRoles,
        },
      });

      if (response.error) throw response.error;

      toast({ title: "Permissões atualizadas com sucesso!" });
      setRolesDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      const response = await supabase.functions.invoke("admin-users", {
        body: { action: "delete", userId: selectedUser.id },
      });

      if (response.error) throw response.error;

      toast({ title: "Usuário excluído com sucesso!" });
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
      case "cliente_admin":
        return "default";
      case "editor":
        return "secondary";
      case "content_manager":
        return "outline";
      default:
        return "secondary";
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários cadastrados no sistema
        </p>
      </div>

      {/* Roles explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Níveis de Acesso Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(rolesInfo).map(([key, info]) => (
              <div key={key} className="flex items-start gap-2 p-2 rounded-lg border">
                <Badge variant={getRoleBadgeVariant(key)} className="mt-0.5">
                  {info.name}
                </Badge>
                <span className="text-sm text-muted-foreground">{info.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários Cadastrados
          </CardTitle>
          <CardDescription>
            Lista completa de usuários com suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum usuário encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || <span className="text-muted-foreground italic">Sem nome</span>}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <Badge variant="secondary">usuário</Badge>
                        ) : (
                          user.roles.map((role) => (
                            <Badge 
                              key={role} 
                              variant={getRoleBadgeVariant(role)}
                            >
                              {rolesInfo[role]?.name || role}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : <span className="text-muted-foreground">Nunca</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(user)}
                          title="Editar dados"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openPasswordDialog(user)}
                          title="Alterar senha"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRolesDialog(user)}
                          title="Gerenciar permissões"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(user)}
                          className="text-destructive hover:text-destructive"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere os dados do usuário abaixo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nome do usuário"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handlePasswordChange} disabled={saving || !newPassword}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Alterar Senha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Roles Dialog */}
      <Dialog open={rolesDialogOpen} onOpenChange={setRolesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Permissões</DialogTitle>
            <DialogDescription>
              Selecione as permissões para {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {Object.entries(rolesInfo).map(([key, info]) => (
              <div key={key} className="flex items-start space-x-3 p-3 rounded-lg border">
                <Checkbox
                  id={key}
                  checked={selectedRoles.includes(key)}
                  onCheckedChange={() => toggleRole(key)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={key}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {info.name}
                  </label>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setRolesDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRolesChange} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Permissões
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{selectedUser?.email}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
