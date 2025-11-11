'use client';

import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Rocket,
  Send,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AboutContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeline = [
    {
      year: '2014',
      title: 'Inicios',
      description:
        'Comenzamos como una pequeña tienda local con productos seleccionados.',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      year: '2017',
      title: 'Expansión',
      description:
        'Lanzamos nuestra plataforma online para llegar a más clientes.',
      icon: <Globe className="h-5 w-5" />,
      color: 'from-blue-400 to-indigo-500',
    },
    {
      year: '2020',
      title: 'Crecimiento',
      description: 'Superamos los 1000 productos y ampliamos nuestro equipo.',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-green-400 to-emerald-500',
    },
    {
      year: '2023',
      title: 'Innovación',
      description:
        'Implementamos tecnología de punta para mejorar la experiencia de compra.',
      icon: <Rocket className="h-5 w-5" />,
      color: 'from-purple-400 to-pink-500',
    },
    {
      year: '2024',
      title: 'Futuro',
      description: 'Continuamos expandiéndonos y mejorando nuestros servicios.',
      icon: <Target className="h-5 w-5" />,
      color: 'from-red-400 to-rose-500',
    },
  ];

  const team = [
    {
      name: 'Ana García',
      position: 'CEO & Fundadora',
      description:
        'Con más de 15 años de experiencia en retail y comercio electrónico.',
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          AG
        </div>
      ),
      skills: ['Liderazgo', 'Estrategia', 'Innovación'],
    },
    {
      name: 'Luis Martínez',
      position: 'Director de Operaciones',
      description: 'Experto en logística y optimización de procesos de compra.',
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          LM
        </div>
      ),
      skills: ['Logística', 'Procesos', 'Optimización'],
    },
    {
      name: 'Sofía Rodríguez',
      position: 'Directora de Marketing',
      description: 'Especialista en branding y experiencia de cliente.',
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          SR
        </div>
      ),
      skills: ['Branding', 'Marketing', 'UX'],
    },
    {
      name: 'Carlos López',
      position: 'Director de Tecnología',
      description:
        'Líder en innovación tecnológica y desarrollo de plataformas.',
      logo: (
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          CL
        </div>
      ),
      skills: ['Tecnología', 'Innovación', 'Desarrollo'],
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      toast.error('Error al enviar el mensaje. Intenta nuevamente.', {
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero Section Mejorado - Responsive */}
        <ScrollReveal animationType="fadeInUpBlur" delay={0.1}>
          <section className="relative mb-12 sm:mb-16 md:mb-20">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-6 sm:p-8 md:p-12 lg:p-20 backdrop-blur-sm border border-white/20 dark:border-black/20 shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-black/[0.02] bg-[size:50px_50px]"></div>
              <div className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-12">
                <div className="w-full">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-foreground text-xs sm:text-sm font-semibold tracking-wide border border-primary/30 dark:border-primary/50 mb-4 sm:mb-6 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    Conoce nuestra historia
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Innovación y calidad en cada producto
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
                    Desde 2014, hemos transformado la experiencia de compra
                    online, ofreciendo productos excepcionales y un servicio
                    inigualable.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 w-full sm:w-auto"
                    >
                      <Link href="#contact">
                        Contáctanos
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="border-2 border-primary/20 hover:border-primary/40 w-full sm:w-auto"
                    >
                      <Link href="#team">Nuestro equipo</Link>
                    </Button>
                  </div>
                </div>

                <div className="w-full max-w-md">
                  <div className="relative">
                    <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl sm:rounded-2xl blur-xl opacity-60"></div>
                    <div className="relative bg-card/80 dark:bg-card/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-border/50">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                            10+
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Años de experiencia
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                            5000+
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Clientes satisfechos
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                            100+
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Productos exclusivos
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                            24/7
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Soporte al cliente
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elementos decorativos flotantes */}
              <div className="absolute top-5 left-5 w-10 h-10 sm:top-10 sm:left-10 sm:w-20 sm:h-20 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-5 right-5 w-16 h-16 sm:bottom-10 sm:right-10 sm:w-32 sm:h-32 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-accent/20 dark:bg-accent/30 rounded-full blur-xl"></div>
            </div>
          </section>
        </ScrollReveal>

        {/* Timeline de historia mejorado - Responsive */}
        <ScrollReveal animationType="fadeInUpBlur" delay={0.2}>
          <section id="history" className="mb-12 sm:mb-16 md:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Nuestra historia
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Un viaje de innovación y crecimiento constante
              </p>
            </div>

            {/* Versión móvil: Timeline vertical */}
            <div className="relative md:hidden">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30"></div>

              {timeline.map((item, index) => (
                <div key={index} className="flex items-start mb-8">
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white shadow-lg`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                      <div
                        className={`inline-block px-2 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-bold mb-2`}
                      >
                        {item.year}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Versión desktop: Timeline alternado */}
            <div className="hidden md:relative md:block">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent opacity-30"></div>

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-1/2"></div>
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white shadow-lg`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div className="w-1/2 px-6">
                    <motion.div
                      className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-bold mb-3`}
                      >
                        {item.year}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Misión, visión y valores mejorados - Responsive */}
        <ScrollReveal animationType="fadeInUpBlur" delay={0.3}>
          <section className="mb-12 sm:mb-16 md:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Lo que nos define
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Los valores que guían cada decisión que tomamos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-3">
                  Nuestra misión
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Ofrecer productos de calidad para el hogar, el cuidado
                  personal y la tecnología, brindando una experiencia de compra
                  sencilla, segura y satisfactoria.
                </p>
              </div>

              <div className="flex flex-col items-center bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-3">
                  Nuestra visión
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Ser la tienda online de referencia en innovación, variedad y
                  servicio al cliente en el mercado hispanohablante.
                </p>
              </div>

              <div className="flex flex-col items-center bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-3">
                  Nuestros valores
                </h2>
                <ul className="space-y-2 text-muted-foreground text-left text-sm sm:text-base">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Calidad y confianza
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Atención personalizada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Innovación constante
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Compromiso con el cliente
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Equipo con logos en lugar de fotos - Responsive */}
        <ScrollReveal animationType="fadeInUpBlur" delay={0.4}>
          <section id="team" className="mb-12 sm:mb-16 md:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Nuestro equipo
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Las mentes creativas detrás de nuestro éxito
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
                >
                  <div className="p-4 sm:p-6 flex flex-col items-center">
                    <div className="mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                        {member.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      {member.name}
                    </h3>
                    <p className="text-primary text-xs sm:text-sm mb-2">
                      {member.position}
                    </p>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 text-center">
                      {member.description}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Testimonios mejorados - Responsive */}
        <ScrollReveal animationType="fadeInUpBlur" delay={0.5}>
          <section className="mb-12 sm:mb-16 md:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                La satisfacción de nuestros clientes es nuestra mejor recompensa
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
              <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-3 text-sm sm:text-base">
                  Excelente atención y productos de primera calidad. ¡Repetiré
                  mi compra!
                </p>
                <span className="text-sm font-semibold text-primary">
                  Ana G.
                </span>
              </div>

              <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-3 text-sm sm:text-base">
                  La entrega fue rápida y el empaque impecable. Muy
                  recomendados.
                </p>
                <span className="text-sm font-semibold text-primary">
                  Luis M.
                </span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Sección de Contacto Mejorada - Responsive */}
        <ScrollReveal animationType="fadeInUpBlur" delay={0.6}>
          <section id="contact" className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ponte en contacto
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Estamos aquí para ayudarte con cualquier consulta
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Información de Contacto */}
              <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 shadow-xl rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-primary to-secondary rounded-t-2xl p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                    Información de Contacto
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                    Estamos aquí para ayudarte con cualquier consulta
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base lg:text-lg">
                          Teléfono
                        </h3>
                        <p className="text-primary font-medium text-sm sm:text-base">
                          +53 59597421
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                          Línea directa 24/7
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base lg:text-lg">
                          Email
                        </h3>
                        <p className="text-primary font-medium text-sm sm:text-base">
                          contacto@tutienda.com
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                          Respuesta en 24 horas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base lg:text-lg">
                          Dirección
                        </h3>
                        <p className="text-primary font-medium text-sm sm:text-base">
                          Calle Principal, Camaguey
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                          Cuba
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulario de Contacto */}
              <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 shadow-xl rounded-2xl h-full">
                <CardHeader className="bg-gradient-to-r from-secondary to-accent rounded-t-2xl p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                    Envíanos un Mensaje
                  </CardTitle>
                  <CardDescription className="text-secondary-foreground/80 text-sm sm:text-base">
                    Completa el formulario y te responderemos pronto
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm sm:text-base">
                          Nombre completo *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Tu nombre completo"
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm sm:text-base">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="tu@email.com"
                          className="text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm sm:text-base">
                        Asunto *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="¿En qué podemos ayudarte?"
                        className="text-sm sm:text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm sm:text-base">
                        Mensaje *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="resize-none text-sm sm:text-base"
                        placeholder="Cuéntanos más sobre tu consulta..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Enviar Mensaje
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* Separador */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-8 sm:my-12"></div>

        {/* Redes sociales minimalistas - Responsive */}
        <div className="flex justify-center gap-4 sm:gap-6">
          {/* Instagram */}
          <Link
            href="https://instagram.com"
            target="_blank"
            aria-label="Síguenos en Instagram"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.334 3.374C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.612.06 1.282.354 2.394 1.334 3.374.98.98 2.092 1.274 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.06 2.394-.354 3.374-1.334.98-.98 1.274-2.092 1.334-3.374.059-1.28.072-1.689.072-7.612 0-5.923-.013-6.332-.072-7.612-.06-1.282-.354-2.394-1.334-3.374-.98-.98-2.092-1.274-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </Link>

          {/* Facebook */}
          <Link
            href="https://facebook.com"
            target="_blank"
            aria-label="Síguenos en Facebook"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
            </svg>
          </Link>

          {/* X (Twitter) - Logo oficial como en el footer */}
          <Link
            href="https://twitter.com"
            target="_blank"
            aria-label="Síguenos en X"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
