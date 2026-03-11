import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';

export default function MemberLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError('Email ou palavra-passe incorrectos.');
        return;
      }

      navigate('/membro');
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, introduza o seu email.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/membro/recuperar-password`,
      });

      if (error) {
        setError('Erro ao enviar email. Tente novamente.');
        return;
      }

      setResetSent(true);
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login de Membro | AEFEM</title>
      </Helmet>
      <Layout>
        <section className="pt-32 pb-20 min-h-screen gradient-hero">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto">
              <Card className="shadow-brand-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">
                    {showReset ? 'Recuperar Palavra-passe' : 'Área de Membro'}
                  </CardTitle>
                  <CardDescription>
                    {showReset
                      ? 'Introduza o seu email para receber um link de recuperação'
                      : 'Entre com os seus dados'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resetSent ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Se o email existir na nossa base de dados, receberá um link para redefinir a sua palavra-passe.
                      </p>
                      <Button variant="outline" onClick={() => { setShowReset(false); setResetSent(false); }}>
                        Voltar ao Login
                      </Button>
                    </div>
                  ) : showReset ? (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar Link de Recuperação'}
                      </Button>
                      <Button type="button" variant="ghost" className="w-full" onClick={() => { setShowReset(false); setError(''); }}>
                        Voltar ao Login
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password">Palavra-passe</Label>
                          <button
                            type="button"
                            onClick={() => { setShowReset(true); setError(''); }}
                            className="text-xs text-primary hover:underline"
                          >
                            Esqueci a palavra-passe
                          </button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Não tem conta?{' '}
                        <Link to="/tornar-se-membro" className="text-primary hover:underline">
                          Registar-se
                        </Link>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
