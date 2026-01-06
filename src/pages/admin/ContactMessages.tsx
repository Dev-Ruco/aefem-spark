import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, MailOpen, Trash2, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();
  const { role } = useAuth();

  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
      setFilteredMessages(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar mensagens.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = messages.filter(msg => 
      msg.name.toLowerCase().includes(query.toLowerCase()) ||
      msg.email.toLowerCase().includes(query.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(query.toLowerCase()) ||
      msg.message.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  const openMessage = async (message: ContactMessage) => {
    setViewMessage(message);
    
    // Mark as read if not already
    if (!message.is_read && isAdmin) {
      try {
        await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', message.id);

        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, is_read: true } : m
        ));
        setFilteredMessages(filteredMessages.map(m => 
          m.id === message.id ? { ...m, is_read: true } : m
        ));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== deleteId));
      setFilteredMessages(filteredMessages.filter(m => m.id !== deleteId));
      toast({
        title: 'Sucesso',
        description: 'Mensagem eliminada.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao eliminar mensagem.',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleRead = async (message: ContactMessage) => {
    if (!isAdmin) return;

    try {
      await supabase
        .from('contact_messages')
        .update({ is_read: !message.is_read })
        .eq('id', message.id);

      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, is_read: !m.is_read } : m
      ));
      setFilteredMessages(filteredMessages.map(m => 
        m.id === message.id ? { ...m, is_read: !m.is_read } : m
      ));
    } catch (error) {
      console.error('Error toggling read:', error);
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: 'is_read',
      header: '',
      className: 'w-[40px]',
      render: (msg) => (
        msg.is_read 
          ? <MailOpen className="h-4 w-4 text-muted-foreground" />
          : <Mail className="h-4 w-4 text-primary" />
      )
    },
    {
      key: 'name',
      header: 'Remetente',
      render: (msg) => (
        <div>
          <span className={`font-medium ${!msg.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
            {msg.name}
          </span>
          <p className="text-xs text-muted-foreground">{msg.email}</p>
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Assunto',
      render: (msg) => (
        <span className={`${!msg.is_read ? 'font-medium' : 'text-muted-foreground'}`}>
          {msg.subject || '(sem assunto)'}
        </span>
      )
    },
    {
      key: 'created_at',
      header: 'Data',
      render: (msg) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(msg.created_at), "d MMM, HH:mm", { locale: pt })}
        </span>
      )
    }
  ];

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Mensagens</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? (
              <span className="text-primary font-medium">{unreadCount} mensagens não lidas</span>
            ) : (
              'Todas as mensagens foram lidas'
            )}
          </p>
        </div>
      </div>

      <DataTable
        data={filteredMessages}
        columns={columns}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Pesquisar mensagens..."
        onSearch={handleSearch}
        emptyMessage="Não existem mensagens de contacto."
        actions={(message) => (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => openMessage(message)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toggleRead(message)}
                  title={message.is_read ? 'Marcar como não lido' : 'Marcar como lido'}
                >
                  {message.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setDeleteId(message.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        )}
      />

      {/* View Message Dialog */}
      <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewMessage?.subject || '(sem assunto)'}</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{viewMessage.name}</span>
                  <span className="text-muted-foreground"> ({viewMessage.email})</span>
                </div>
                <span className="text-muted-foreground">
                  {format(new Date(viewMessage.created_at), "d 'de' MMMM 'às' HH:mm", { locale: pt })}
                </span>
              </div>
              <div className="border-t border-border pt-4">
                <p className="whitespace-pre-wrap text-foreground">{viewMessage.message}</p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" asChild>
                  <a href={`mailto:${viewMessage.email}?subject=Re: ${viewMessage.subject || 'Contacto AEFEM'}`}>
                    Responder por Email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Eliminar Mensagem"
        description="Tem a certeza que deseja eliminar esta mensagem? Esta acção é irreversível."
        confirmText="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
