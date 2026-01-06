import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import logo from '@/assets/logo-aefem.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres')
});

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdminOrEditor, isLoading: authLoading } = useAuth();

  // Redirect if already logged in and is admin/editor
  if (!authLoading && user && isAdminOrEditor) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou password incorretos.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        // Check if user has admin or editor role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (roleError) {
          setError('Erro ao verificar permissões.');
          await supabase.auth.signOut();
          return;
        }

        if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'editor')) {
          setError('Não tem permissões para aceder ao painel administrativo.');
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: 'Bem-vindo!',
          description: 'Login efectuado com sucesso.'
        });
        navigate('/admin');
      }
    } catch (err: any) {
      setError('Erro ao efectuar login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md animate-fade-up">
        <Card className="shadow-brand-lg border-border">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="AEFEM" className="h-16 w-auto" />
            </div>
            <div>
              <CardTitle className="text-2xl font-display">Painel Administrativo</CardTitle>
              <CardDescription>Entre com as suas credenciais</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@aefem.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A entrar...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <a href="/" className="hover:text-primary transition-colors">
            ← Voltar ao site
          </a>
        </p>
      </div>
    </div>
  );
}
