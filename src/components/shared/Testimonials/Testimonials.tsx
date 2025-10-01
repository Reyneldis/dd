'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ThumbsUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(
    new Set(),
  );
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch('/api/reviews/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap());
    });
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  const handleLike = (id: string) => {
    setLikedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredTestimonials = filterRating
    ? testimonials.filter(t => t.rating === filterRating)
    : testimonials;

  // Duplicar testimonios para scroll infinito
  const duplicatedTestimonials =
    filteredTestimonials.length > 0
      ? [...filteredTestimonials, ...filteredTestimonials]
      : [];

  const total = filteredTestimonials.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 md:h-4 md:w-4 transition-all duration-300 ${
          i < rating
            ? 'text-yellow-400 fill-current drop-shadow-sm'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Fondo decorativo mejorado con colores del componente StatsCounter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-amber-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado con colores del componente StatsCounter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-900/30 dark:to-amber-900/30 text-emerald-700 dark:text-emerald-300 text-sm md:text-base font-semibold mb-4 shadow-md">
            <Users className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
            Testimonios Reales
          </div>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl md:text-5xl mt-4 font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-6 md:mb-8"
          >
            Lo que dicen nuestros{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700">
              clientes
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-medium px-4">
            Más de{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              500 clientes satisfechos
            </span>{' '}
            ya disfrutan de la experiencia express
          </p>

          {/* Filtros de calificación */}
          <div className="flex justify-center mt-6 md:mt-8 gap-2 flex-wrap px-4">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                filterRating === null
                  ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            {[5, 4, 3].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1 ${
                  filterRating === rating
                    ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {rating}
                <Star className="h-3 w-3 fill-current" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contenedor principal con carrusel */}
        <div className="w-full max-w-4xl mx-auto">
          {loading ? (
            <div className="w-full flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-24 md:h-32 rounded-3xl" />
              ))}
            </div>
          ) : (
            <Carousel
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: false,
                }),
              ]}
              setApi={setApi}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CarouselContent>
                {duplicatedTestimonials.map(
                  ({ id, name, avatar, text, rating, createdAt }, index) => (
                    <CarouselItem key={`${id}-${index}`}>
                      <Card
                        className={`group relative w-full h-24 md:h-32 flex items-center justify-center rounded-2xl md:rounded-3xl bg-background/60 backdrop-blur-xl shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl cursor-pointer overflow-hidden mx-auto ${
                          activeIndex === index % total
                            ? 'ring-2 ring-emerald-500/30'
                            : ''
                        }`}
                      >
                        {/* Efecto de gradiente de fondo */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        ></div>

                        {/* Elementos decorativos */}
                        <div className="absolute top-1 md:top-2 right-1 md:right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-emerald-500 animate-pulse" />
                        </div>

                        <CardContent className="flex items-center p-3 md:p-6 w-full h-full text-center relative z-10">
                          {/* Avatar */}
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border border-emerald-300/50 bg-gradient-to-br from-emerald-200/50 to-amber-200/50 flex items-center justify-center flex-shrink-0 mr-2 md:mr-4">
                            {avatar ? (
                              <Image
                                src={avatar}
                                alt={name}
                                width={48}
                                height={48}
                                unoptimized
                                className="w-full h-full object-cover"
                                onError={() => {
                                  // sin-op fallback
                                }}
                              />
                            ) : (
                              <span className="text-xs md:text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                {name
                                  .split(' ')
                                  .map(word => word[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                              <p className="text-sm md:text-xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-emerald-600 group-hover:to-emerald-800 transition-all duration-300 truncate">
                                {name}
                              </p>
                              <div className="flex items-center gap-1">
                                {renderStars(rating)}
                                <span className="text-xs text-muted-foreground ml-1 hidden md:inline">
                                  {rating}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 max-w-xs md:max-w-md truncate hidden sm:block">
                              &ldquo;{text}&rdquo;
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 flex-shrink-0 hidden sm:block" />
                              <span className="hidden sm:block">
                                {createdAt
                                  ? new Date(createdAt).toLocaleDateString(
                                      'es-ES',
                                      {
                                        month: 'short',
                                        day: 'numeric',
                                      },
                                    )
                                  : 'Cliente'}
                              </span>
                            </div>
                          </div>

                          {/* Botón de like - Solo visible en desktop */}
                          <button
                            onClick={() => handleLike(id)}
                            className={`hidden md:flex p-2 rounded-full transition-all backdrop-blur-sm flex-shrink-0 ${
                              likedTestimonials.has(id)
                                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-300/30'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'
                            }`}
                            aria-label="Me gusta este testimonio"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                        </CardContent>

                        {/* Efecto de brillo al hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </Card>
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>

              {/* Botones de navegación mejorados */}
              <div className="flex justify-center gap-3 mt-6">
                <CarouselPrevious
                  className={`static bg-background/60 backdrop-blur-sm text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-full border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 size-8 md:size-10 hover:scale-110 ${
                    isHovered ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </CarouselPrevious>
                <CarouselNext
                  className={`static bg-background/60 backdrop-blur-sm text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-full border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 size-8 md:size-10 hover:scale-110 ${
                    isHovered ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </CarouselNext>
              </div>

              {/* Dots mejorados con animaciones */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: total }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`relative w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                      activeIndex === idx
                        ? 'bg-emerald-600 shadow-lg shadow-emerald-600/50 scale-125'
                        : 'bg-muted/50 hover:bg-muted border border-border/30'
                    }`}
                    onClick={() => api && api.scrollTo(idx)}
                    aria-label={`Ir al testimonio ${idx + 1}`}
                  >
                    {activeIndex === idx && (
                      <div className="absolute inset-0 rounded-full bg-emerald-600 animate-ping opacity-75"></div>
                    )}
                  </button>
                ))}
              </div>
            </Carousel>
          )}

          {/* Indicador de progreso */}
          <div className="w-full max-w-2xl h-1 bg-muted/20 rounded-full mt-6 overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-amber-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* CTA mejorado con colores del componente StatsCounter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <button className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-amber-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group text-sm md:text-base">
            <Users className="h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce" />
            Ver más testimonios
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Estilos para ocultar el scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
        }}
      />
    </section>
  );
}
