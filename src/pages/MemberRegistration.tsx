import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
import { Loader2, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';

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
  'Cabo Delgado',
];

export default function MemberRegistration() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    profession: '',
    age: '',
    whatsapp_number: '',
    province: '',
    access_code: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.full_name.trim() || !form.whatsapp_number.trim() || !form.province || !form.access_code.trim()) {
      setError(isEn ? 'Please fill in all required fields.' : 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (form.full_name.trim().length > 100) {
      setError(isEn ? 'Name is too long.' : 'Nome demasiado longo.');
      return;
    }

    const ageNum = form.age ? parseInt(form.age) : null;
    if (form.age && (isNaN(ageNum!) || ageNum! < 14 || ageNum! > 120)) {
      setError(isEn ? 'Please enter a valid age.' : 'Por favor, introduza uma idade válida.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('membership_applications' as any)
        .insert({
          full_name: form.full_name.trim(),
          profession: form.profession.trim() || null,
          age: ageNum,
          whatsapp_number: form.whatsapp_number.trim(),
          province: form.province,
          access_code: form.access_code.trim(),
        } as any);

      if (insertError) {
        console.error('Insert error:', insertError);
        setError(isEn ? 'An error occurred. Please try again.' : 'Ocorreu um erro. Tente novamente.');
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(isEn ? 'Unexpected error. Please try again.' : 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <>
        <Helmet>
          <title>{isEn ? 'Registration Complete' : 'Inscrição Recebida'} | AEFEM</title>
        </Helmet>
        <Layout>
          <section className="pt-32 pb-20 min-h-screen gradient-hero">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-4">
                  {isEn ? 'Application Received!' : 'Inscrição Recebida!'}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {isEn
                    ? 'Your application has been received successfully. We will contact you soon.'
                    : 'A sua inscrição foi recebida com sucesso. Em breve entraremos em contacto.'}
                </p>
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
        <title>{isEn ? 'Become a Member' : 'Tornar-se Membro'} | AEFEM</title>
        <meta
          name="description"
          content={isEn ? 'Join AEFEM - Association for Women Empowerment' : 'Junte-se à AEFEM - Associação do Empoderamento Feminino'}
        />
      </Helmet>

      <Layout>
        <section className="pt-32 pb-20 min-h-screen gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                  {isEn ? 'Become a Member' : 'Tornar-se Membro'}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {isEn
                    ? 'Fill in your details to join our community.'
                    : 'Preencha os seus dados para se juntar à nossa comunidade.'}
                </p>
              </div>

              {/* Form */}
              <Card className="shadow-brand-lg">
                <CardContent className="pt-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Nome completo */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-base">
                        {isEn ? 'Full Name' : 'Nome Completo'} *
                      </Label>
                      <Input
                        id="full_name"
                        value={form.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder={isEn ? 'Your full name' : 'O seu nome completo'}
                        className="h-12 text-base"
                        required
                        maxLength={100}
                      />
                    </div>

                    {/* Profissão */}
                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-base">
                        {isEn ? 'Profession' : 'Profissão'}
                      </Label>
                      <Input
                        id="profession"
                        value={form.profession}
                        onChange={(e) => handleChange('profession', e.target.value)}
                        placeholder={isEn ? 'e.g. Teacher, Farmer' : 'ex: Professora, Agricultora'}
                        className="h-12 text-base"
                        maxLength={100}
                      />
                    </div>

                    {/* Idade + WhatsApp */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-base">
                          {isEn ? 'Age' : 'Idade'}
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          min={14}
                          max={120}
                          value={form.age}
                          onChange={(e) => handleChange('age', e.target.value)}
                          placeholder="ex: 28"
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="text-base">
                          WhatsApp *
                        </Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          value={form.whatsapp_number}
                          onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                          placeholder="+258 84 000 0000"
                          className="h-12 text-base"
                          required
                          maxLength={20}
                        />
                      </div>
                    </div>

                    {/* Província */}
                    <div className="space-y-2">
                      <Label className="text-base">
                        {isEn ? 'Province' : 'Província'} *
                      </Label>
                      <Select value={form.province} onValueChange={(v) => handleChange('province', v)}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder={isEn ? 'Select province' : 'Seleccione a província'} />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Código de acesso */}
                    <div className="space-y-2">
                      <Label htmlFor="access_code" className="text-base">
                        {isEn ? 'Access Code' : 'Código de Acesso'} *
                      </Label>
                      <Input
                        id="access_code"
                        value={form.access_code}
                        onChange={(e) => handleChange('access_code', e.target.value)}
                        placeholder={isEn ? 'Enter your code' : 'Introduza o seu código'}
                        className="h-12 text-base"
                        required
                        maxLength={50}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-primary text-base h-14 mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {isEn ? 'Submitting...' : 'A enviar...'}
                        </>
                      ) : (
                        isEn ? 'Submit Application' : 'Submeter Inscrição'
                      )}
                    </Button>
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
