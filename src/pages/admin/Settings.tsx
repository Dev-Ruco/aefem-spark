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
import { UserPlus, Trash2, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
  email?: string;
}

export default function Settings() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role, created_at')
        .order('created_at');

      if (error) throw error;
      setUserRoles((data || []).map(r => ({ ...r, profiles: null })));
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar utilizadores.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      toast({
        title: 'Erro',
        description: 'Insira o ID do utilizador.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Check if role already exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', newEmail)
        .maybeSingle();

      if (existing) {
        toast({
          title: 'Aviso',
          description: 'Este utilizador já tem uma role atribuída.',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: newEmail,
          role: newRole
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Role atribuída com sucesso.'
      });
      setNewEmail('');
      fetchUserRoles();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao atribuir role. Verifique se o ID do utilizador é válido.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setUserRoles(userRoles.filter(r => r.id !== deleteId));
      toast({
        title: 'Sucesso',
        description: 'Role removida.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover role.',
        variant: 'destructive'
      });
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
          <span className="font-medium">
            {role.profiles?.full_name || 'Utilizador'}
          </span>
          <p className="text-xs text-muted-foreground font-mono">{role.user_id}</p>
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
        <p className="text-muted-foreground mt-1">Gerir utilizadores e permissões</p>
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
                <Label htmlFor="user_id">ID do Utilizador</Label>
                <Input
                  id="user_id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="UUID do utilizador"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Copie o UUID da tabela auth.users no Supabase
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

      {/* Instructions */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Como adicionar o primeiro administrador</h3>
              <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                <li>Registe-se no site através do formulário de registo (se existir) ou crie um utilizador no Supabase Dashboard</li>
                <li>Copie o UUID do utilizador da tabela <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">auth.users</code></li>
                <li>Cole o UUID no campo "ID do Utilizador" acima e seleccione a role "Administrador"</li>
                <li>Clique em "Adicionar Role" para activar as permissões</li>
              </ol>
            </div>
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
