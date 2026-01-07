import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  position_en: string | null;
  photo_url: string | null;
  bio: string | null;
  bio_en: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

interface TeamMemberForm {
  full_name: string;
  position: string;
  position_en: string;
  photo_url: string;
  bio: string;
  bio_en: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm: TeamMemberForm = {
  full_name: '',
  position: '',
  position_en: '',
  photo_url: '',
  bio: '',
  bio_en: '',
  display_order: 0,
  is_active: true
};

export default function TeamMembersList() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMemberForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error:', error);
    } else {
      setMembers(data || []);
    }
    setIsLoading(false);
  };

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setForm({
      full_name: member.full_name,
      position: member.position,
      position_en: member.position_en || '',
      photo_url: member.photo_url || '',
      bio: member.bio || '',
      bio_en: member.bio_en || '',
      display_order: member.display_order || 0,
      is_active: member.is_active ?? true
    });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setSelectedMember(null);
    setForm({ ...emptyForm, display_order: members.length });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.position.trim()) {
      toast({ title: 'Erro', description: 'Nome e cargo são obrigatórios.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      const memberData = {
        full_name: form.full_name,
        position: form.position,
        position_en: form.position_en || null,
        photo_url: form.photo_url || null,
        bio: form.bio || null,
        bio_en: form.bio_en || null,
        display_order: form.display_order,
        is_active: form.is_active
      };

      if (selectedMember) {
        const { error } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', selectedMember.id);

        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Colaborador actualizado.' });
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([memberData]);

        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Colaborador adicionado.' });
      }

      setDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', selectedMember.id);

      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Colaborador removido.' });
      setDeleteDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  const toggleActive = async (member: TeamMember) => {
    const { error } = await supabase
      .from('team_members')
      .update({ is_active: !member.is_active })
      .eq('id', member.id);

    if (!error) {
      fetchMembers();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Equipa</h1>
          <p className="text-muted-foreground mt-1">Gerir colaboradores e direção da AEFEM</p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <div className="aspect-square relative overflow-hidden bg-muted">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-4xl font-bold text-primary">
                    {member.full_name.charAt(0)}
                  </span>
                </div>
              )}
              <Badge 
                className="absolute top-2 right-2"
                variant={member.is_active ? 'default' : 'secondary'}
              >
                {member.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{member.full_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{member.position}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(member)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedMember(member);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <Switch
                    checked={member.is_active ?? true}
                    onCheckedChange={() => toggleActive(member)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum colaborador registado. Clique em "Adicionar" para criar o primeiro.
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? 'Editar Colaborador' : 'Novo Colaborador'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do colaborador
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Cargo (PT) *</Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Ex: Presidente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position_en">Cargo (EN)</Label>
                <Input
                  id="position_en"
                  value={form.position_en}
                  onChange={(e) => setForm(prev => ({ ...prev, position_en: e.target.value }))}
                  placeholder="Ex: President"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fotografia</Label>
              <ImageUploader
                bucket="team"
                currentImage={form.photo_url}
                onUpload={(url) => setForm(prev => ({ ...prev, photo_url: url }))}
                onRemove={() => setForm(prev => ({ ...prev, photo_url: '' }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia (PT)</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio_en">Biografia (EN)</Label>
                <Textarea
                  id="bio_en"
                  value={form.bio_en}
                  onChange={(e) => setForm(prev => ({ ...prev, bio_en: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Colaborador Activo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {selectedMember ? 'Actualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Eliminar Colaborador"
        description={`Tem a certeza que deseja eliminar "${selectedMember?.full_name}"? Esta acção não pode ser revertida.`}
      />
    </div>
  );
}
