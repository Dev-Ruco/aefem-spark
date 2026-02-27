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
import { useLanguage } from '@/contexts/LanguageContext';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const contactInfo = [
    { icon: MapPin, title: t('contact.address_label'), value: 'Maputo, Moçambique' },
    { icon: Phone, title: t('contact.phone_label'), value: '+258 84 000 0000', href: 'tel:+258840000000' },
    { icon: Mail, title: t('contact.email_label'), value: 'info@aefem.org.mz', href: 'mailto:info@aefem.org.mz' },
  ];

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

      toast.success(t('contact.success'));
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.title')} | AEFEM</title>
        <meta name="description" content={t('contact.meta_desc')} />
      </Helmet>

      <Layout>
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle={t('contact.subtitle')}
              title={t('contact.title')}
              description={t('contact.description')}
            />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold mb-6">{t('contact.info_title')}</h2>
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

                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <span className="text-muted-foreground">{t('contact.map_soon')}</span>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="font-display text-2xl font-bold mb-6">{t('contact.form_title')}</h2>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('contact.name')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('contact.name_placeholder')} {...field} />
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
                                <FormLabel>{t('contact.email')}</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder={t('contact.email_placeholder')} {...field} />
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
                              <FormLabel>{t('contact.subject')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('contact.subject_placeholder')} {...field} />
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
                              <FormLabel>{t('contact.message')}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('contact.message_placeholder')}
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
                            t('contact.sending')
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              {t('contact.send')}
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
