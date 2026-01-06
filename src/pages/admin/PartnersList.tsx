import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, ExternalLink, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

interface PartnerForm {
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  is_active: boolean;
}

export default function PartnersList() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [form, setForm] = useState<PartnerForm>({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar parceiros.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setForm({
        name: partner.name,
        logo_url: partner.logo_url || '',
        website_url: partner.website_url || '',
        description: partner.description || '',
        is_active: partner.is_active
      });
    } else {
      setEditingPartner(null);
      setForm({
        name: '',
        logo_url: '',
        website_url: '',
        description: '',
        is_active: true
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome é obrigatório.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const partnerData = {
        name: form.name,
        logo_url: form.logo_url || null,
        website_url: form.website_url || null,
        description: form.description || null,
        is_active: form.is_active,
        display_order: editingPartner ? editingPartner.display_order : partners.length
      };

      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(partnerData)
          .eq('id', editingPartner.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('partners')
          .insert(partnerData);

        if (error) throw error;
      }

      toast({
        title: 'Sucesso',
        description: editingPartner ? 'Parceiro actualizado.' : 'Parceiro criado.'
      });
      setDialogOpen(false);
      fetchPartners();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao guardar parceiro.',
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
        .from('partners')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setPartners(partners.filter(p => p.id !== deleteId));
      toast({
        title: 'Sucesso',
        description: 'Parceiro eliminado.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao eliminar parceiro.',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_active: !partner.is_active })
        .eq('id', partner.id);

      if (error) throw error;

      setPartners(partners.map(p => 
        p.id === partner.id ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao actualizar parceiro.',
        variant: 'destructive'
      });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Parceiros</h1>
          <p className="text-muted-foreground mt-1">Gerir parceiros e apoiantes</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Parceiro
        </Button>
      </div>

      {partners.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Ainda não existem parceiros.</p>
            <Button onClick={() => openDialog()} className="mt-4">
              Adicionar Primeiro Parceiro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <Card 
              key={partner.id} 
              className={`overflow-hidden transition-all ${!partner.is_active ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    {partner.logo_url ? (
                      <img 
                        src={partner.logo_url} 
                        alt={partner.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {partner.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{partner.name}</h3>
                    {partner.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {partner.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      {partner.website_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openDialog(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteId(partner.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex-1" />
                      <Switch 
                        checked={partner.is_active}
                        onCheckedChange={() => toggleActive(partner)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do parceiro"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUploader
                bucket="partners"
                currentImage={form.logo_url}
                onUpload={(url) => setForm(prev => ({ ...prev, logo_url: url }))}
                onRemove={() => setForm(prev => ({ ...prev, logo_url: '' }))}
                aspectRatio="square"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website</Label>
              <Input
                id="website_url"
                type="url"
                value={form.website_url}
                onChange={(e) => setForm(prev => ({ ...prev, website_url: e.target.value }))}
                placeholder="https://exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição breve"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Activo</Label>
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  editingPartner ? 'Actualizar' : 'Criar'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Eliminar Parceiro"
        description="Tem a certeza que deseja eliminar este parceiro?"
        confirmText="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
