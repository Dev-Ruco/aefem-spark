import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: 'Morada',
    value: 'Maputo, Moçambique',
  },
  {
    icon: Phone,
    title: 'Telefone',
    value: '+258 84 000 0000',
    href: 'tel:+258840000000',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@aefem.org.mz',
    href: 'mailto:info@aefem.org.mz',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name: values.name, email: values.email, subject: values.subject || null, message: values.message }]);

      if (error) throw error;

      toast.success('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contacto | AEFEM</title>
        <meta name="description" content="Entre em contacto com a AEFEM. Estamos disponíveis para responder às suas questões e receber sugestões." />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle="Fale Connosco"
              title="Contacto"
              description="Tem questões, sugestões ou quer colaborar connosco? Entre em contacto!"
            />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold mb-6">Informações de Contacto</h2>
                {contactInfo.map((info) => (
                  <Card key={info.title} className="border-border/50">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shrink-0">
                        <info.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Map placeholder */}
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <span className="text-muted-foreground">Mapa em breve</span>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-display text-2xl font-bold mb-6">Envie-nos uma Mensagem</h2>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome *</FormLabel>
                                <FormControl>
                                  <Input placeholder="O seu nome" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="O seu email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assunto</FormLabel>
                              <FormControl>
                                <Input placeholder="Assunto da mensagem" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mensagem *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Escreva a sua mensagem..."
                                  className="min-h-[150px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
                        >
                          {isSubmitting ? (
                            'A enviar...'
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Enviar Mensagem
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
