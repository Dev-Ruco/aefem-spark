import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Shield, Loader2, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'member';
  created_at: string;
  email?: string;
}

export default function Settings() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [isSavingLink, setIsSavingLink] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
    fetchWhatsAppLink();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role, created_at')
        .order('created_at');

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Erro ao carregar utilizadores.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWhatsAppLink = async () => {
    const { data } = await supabase
      .from('site_settings' as any)
      .select('value')
      .eq('key', 'whatsapp_group_link')
      .maybeSingle();
    if (data) setWhatsappLink((data as any).value || '');
  };

  const handleSaveWhatsAppLink = async () => {
    setIsSavingLink(true);
    try {
      const { error } = await supabase
        .from('site_settings' as any)
        .upsert({ key: 'whatsapp_group_link', value: whatsappLink } as any, { onConflict: 'key' });
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Link do grupo WhatsApp guardado.' });
    } catch {
      toast({ title: 'Erro', description: 'Erro ao guardar link.', variant: 'destructive' });
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim() || !newEmail.includes('@')) {
      toast({ title: 'Erro', description: 'Insira um email válido.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      // Look up user by email via edge function
      const { data, error } = await supabase.functions.invoke('lookup-user-by-email', {
        body: { email: newEmail.trim() },
      });

      if (error || data?.error) {
        toast({
          title: 'Erro',
          description: data?.error || 'Utilizador não encontrado com este email.',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }

      const userId = data.user_id;

      // Check if role already exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        toast({ title: 'Aviso', description: 'Este utilizador já tem uma role atribuída.', variant: 'destructive' });
        setIsSaving(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;

      toast({ title: 'Sucesso', description: `Role "${newRole}" atribuída a ${newEmail}.` });
      setNewEmail('');
      fetchUserRoles();
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Erro ao atribuir role.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('user_roles').delete().eq('id', deleteId);
      if (error) throw error;
      setUserRoles(userRoles.filter(r => r.id !== deleteId));
      toast({ title: 'Sucesso', description: 'Role removida.' });
    } catch {
      toast({ title: 'Erro', description: 'Erro ao remover role.', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<UserRole>[] = [
    {
      key: 'user_id',
      header: 'Utilizador',
      render: (role) => (
        <div>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{role.user_id}</p>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (role) => (
        <Badge variant={role.role === 'admin' ? 'default' : 'secondary'}>
          <Shield className="h-3 w-3 mr-1" />
          {role.role === 'admin' ? 'Administrador' : 'Editor'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerir utilizadores, permissões e definições</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Role Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Adicionar Role
            </CardTitle>
            <CardDescription>
              Atribuir permissões a um utilizador registado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRole} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_email">Email do Utilizador</Label>
                <Input
                  id="user_email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="utilizador@email.com"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Introduza o email do utilizador registado no site
                </p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={(v: 'admin' | 'editor') => setNewRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A adicionar...
                  </>
                ) : (
                  'Adicionar Role'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Utilizadores com Permissões</CardTitle>
            <CardDescription>
              Utilizadores que podem aceder ao painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={userRoles}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="Ainda não existem utilizadores com roles atribuídas."
              actions={(role) => (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(role.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Group Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Link do Grupo de WhatsApp dos Membros
          </CardTitle>
          <CardDescription>
            Este link será mostrado no painel de cada membro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="wa_link">Link do Grupo</Label>
              <Input
                id="wa_link"
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
            <Button onClick={handleSaveWhatsAppLink} disabled={isSavingLink}>
              {isSavingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Remover Role"
        description="Tem a certeza que deseja remover esta role? O utilizador perderá acesso ao painel administrativo."
        confirmText="Remover"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
