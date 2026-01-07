import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const provinces = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Niassa',
  'Cabo Delgado'
];

const currentYear = new Date().getFullYear();
const birthYears = Array.from({ length: 71 }, (_, i) => currentYear - 18 - i);

export default function MemberRegistration() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    birth_year: '',
    province: '',
    whatsapp_number: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    if (!form.full_name || !form.gender || !form.birth_year || !form.province || !form.whatsapp_number || !form.email || !form.password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (form.password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/membro`,
          data: {
            full_name: form.full_name
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email já está registado. Tente fazer login.');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (!authData.user) {
        setError('Erro ao criar conta. Tente novamente.');
        return;
      }

      // 2. Create member record
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          user_id: authData.user.id,
          full_name: form.full_name,
          gender: form.gender,
          birth_year: parseInt(form.birth_year),
          province: form.province,
          whatsapp_number: form.whatsapp_number,
          status: 'active'
        });

      if (memberError) {
        console.error('Error creating member:', memberError);
        // Don't show error to user as the auth user was created
      }

      // 3. Add member role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'member'
        });

      if (roleError) {
        console.error('Error assigning role:', roleError);
      }

      // Show success message
      setShowSuccess(true);
      toast.success('Registo efectuado com sucesso!');

    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <>
        <Helmet>
          <title>Registo Concluído | AEFEM</title>
        </Helmet>
        <Layout>
          <section className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-lg mx-auto">
                <Card className="shadow-brand-lg">
                  <CardContent className="pt-8 text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold mb-2">Bem-vindo à AEFEM!</h2>
                      <p className="text-muted-foreground">O seu registo foi concluído com sucesso.</p>
                    </div>
                    
                    <Alert className="text-left bg-primary/5 border-primary/20">
                      <Heart className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        {t('member.quota_message')}
                      </AlertDescription>
                    </Alert>

                    <div className="pt-4">
                      <Button 
                        onClick={() => navigate('/membro')} 
                        className="w-full gradient-primary"
                      >
                        Aceder ao Painel de Membro
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('member.register_title')} | AEFEM</title>
        <meta name="description" content={t('member.register_desc')} />
      </Helmet>
      
      <Layout>
        <section className="pt-32 pb-20 min-h-screen gradient-hero">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                  {t('member.register_title')}
                </h1>
                <p className="text-muted-foreground">{t('member.register_desc')}</p>
              </div>

              <Card className="shadow-brand-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Dados de Registo</CardTitle>
                  <CardDescription>Preencha os seus dados para se tornar membro</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="full_name">{t('member.full_name')} *</Label>
                      <Input
                        id="full_name"
                        value={form.full_name}
                        onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="O seu nome completo"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('member.gender')} *</Label>
                        <Select
                          value={form.gender}
                          onValueChange={(value) => setForm(prev => ({ ...prev, gender: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feminino">{t('member.gender_female')}</SelectItem>
                            <SelectItem value="masculino">{t('member.gender_male')}</SelectItem>
                            <SelectItem value="outro">{t('member.gender_other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('member.birth_year')} *</Label>
                        <Select
                          value={form.birth_year}
                          onValueChange={(value) => setForm(prev => ({ ...prev, birth_year: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Ano" />
                          </SelectTrigger>
                          <SelectContent>
                            {birthYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('member.province')} *</Label>
                      <Select
                        value={form.province}
                        onValueChange={(value) => setForm(prev => ({ ...prev, province: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione a província" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>{province}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">{t('member.whatsapp')} *</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={form.whatsapp_number}
                        onChange={(e) => setForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                        placeholder="+258 84 000 0000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('member.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu.email@exemplo.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('member.password')} *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                      />
                    </div>

                    <Alert className="bg-primary/5 border-primary/20">
                      <Heart className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-xs">
                        {t('member.quota_message')}
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('member.registering')}
                        </>
                      ) : (
                        t('member.register_btn')
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      {t('member.already_member')}{' '}
                      <Link to="/membro/login" className="text-primary hover:underline font-medium">
                        {t('member.login')}
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
