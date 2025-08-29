'use client';
import UserAvatar from '@/components/shared/UserAvatar';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  rating: number;
  createdAt: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/reviews/testimonials');

        if (!response.ok) {
          throw new Error('Error al cargar los testimonios');
        }

        const data = await response.json();

        // Verificar si hay testimonios en la respuesta
        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        } else {
          // Si no hay testimonios, establecer el array como vacío
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Error de conexión al cargar testimonios');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-base font-semibold mb-4 shadow-md">
            <Users className="h-5 w-5 animate-pulse" />
            Testimonios Reales
          </div>
          <h2 className="text-3xl sm:text-5xl mt-4 md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Más de{' '}
            <span className="font-bold text-primary">
              500 clientes satisfechos
            </span>{' '}
            ya disfrutan de la experiencia express
          </p>
        </motion.div>

        {/* Mensaje de error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-50 text-red-700 rounded-2xl">
              <Users className="h-8 w-8" />
              <span className="text-xl font-semibold">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Testimonios Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {loading ? (
            // Skeletons mejorados
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={cardVariants}
                className="relative p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/20 shadow-lg h-full"
              >
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </motion.div>
            ))
          ) : testimonials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-muted/50 rounded-2xl">
                <Users className="h-8 w-8 text-muted-foreground" />
                <span className="text-xl font-semibold text-muted-foreground">
                  No hay testimonios disponibles aún
                </span>
              </div>
            </motion.div>
          ) : (
            testimonials.slice(0, 6).map(testimonial => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                className="group relative p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col"
              >
                {/* Badge de verificación */}
                <div className="absolute top-4 right-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Verificado
                  </div>
                </div>

                {/* Quote icon */}
                <div className="absolute top-6 left-6 opacity-10">
                  <Quote className="h-8 w-8 text-primary" />
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {testimonial.rating}/5
                    </span>
                  </div>

                  {/* Texto del testimonio */}
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Información del cliente */}
                  <div className="flex items-center gap-3 mt-auto">
                    <UserAvatar
                      user={{
                        id: testimonial.id,
                        firstName: testimonial.name.split(' ')[0],
                        lastName:
                          testimonial.name.split(' ').slice(1).join(' ') || '',
                        imageUrl: testimonial.avatar,
                        primaryEmailAddress: {
                          emailAddress: `${testimonial.name
                            .toLowerCase()
                            .replace(' ', '.')}@example.com`,
                        },
                      }}
                      className="w-10 h-10"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.createdAt
                          ? new Date(testimonial.createdAt).toLocaleDateString(
                              'es-ES',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              },
                            )
                          : 'Cliente satisfecho'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Efecto hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <Users className="h-5 w-5" />
            Ver más testimonios
            <ArrowRight className="h-5 w-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
