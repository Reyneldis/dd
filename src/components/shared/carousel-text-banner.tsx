'use client';
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from '../ui/carousel';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const dataCarousel = [
  {
    id: 1,
    title: '🚚 Envío en 24/48 horas',
    description: 'Como cliente VIP, tus envíos llegan rapidísimo',
    link: '#!',
    icon: '🚚',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: '🎁 Promos exclusivas',
    description: 'Descuentos y sorpresas solo para miembros',
    link: '#!',
    icon: '🎁',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: '🛡️ Compra segura',
    description: 'Tus datos y pagos están protegidos',
    link: '#!',
    icon: '🛡️',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    title: '⭐ Novedades semanales',
    description: '¡Siempre hay algo nuevo para ti!',
    link: '#!',
    icon: '⭐',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 5,
    title: '💬 Soporte 24/7',
    description: 'Estamos para ayudarte en todo momento',
    link: '#!',
    icon: '💬',
    gradient: 'from-red-500 to-rose-500',
  },
];

export default function CarouselTextBanner() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const total = dataCarousel.length;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on('select', () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-32 mb-4 relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/3 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {loading ? (
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-3xl" />
          ))}
        </div>
      ) : (
        <Carousel
          className="w-full max-w-4xl relative"
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
            {dataCarousel.map(
              ({ id, title, description, link, icon, gradient }, index) => (
                <CarouselItem key={id}>
                  <Link href={link} className="flex justify-center">
                    <Card
                      className={`group relative w-full max-w-2xl h-32 flex items-center justify-center rounded-3xl bg-background/60 backdrop-blur-xl shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl cursor-pointer overflow-hidden ${
                        selectedIndex === index ? 'ring-2 ring-primary/30' : ''
                      }`}
                      style={{ minWidth: 0 }}
                    >
                      {/* Efecto de gradiente de fondo */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>

                      {/* Elementos decorativos */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      </div>

                      <CardContent className="flex flex-col justify-center items-center p-6 w-full h-full text-center relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl animate-bounce">
                            {icon}
                          </span>
                          <p className="text-xl sm:text-2xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                            {title}
                          </p>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 max-w-md">
                          {description}
                        </p>
                      </CardContent>

                      {/* Efecto de brillo al hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Card>
                  </Link>
                </CarouselItem>
              ),
            )}
          </CarouselContent>

          {/* Botones de navegación mejorados */}
          <div className="flex justify-center gap-3 mt-6">
            <CarouselPrevious
              className={`static relative !top-0 !left-0 !translate-x-0 !translate-y-0 bg-background/60 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground rounded-full border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 size-10 hover:scale-110 ${
                isHovered ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext
              className={`static relative !top-0 !right-0 !translate-x-0 !translate-y-0 bg-background/60 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground rounded-full border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 size-10 hover:scale-110 ${
                isHovered ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </div>

          {/* Dots mejorados con animaciones */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                className={`relative w-3 h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                  selectedIndex === idx
                    ? 'bg-primary shadow-lg shadow-primary/50 scale-125'
                    : 'bg-muted/50 hover:bg-muted border border-border/30'
                }`}
                onClick={() => api && api.scrollTo(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
              >
                {selectedIndex === idx && (
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                )}
              </button>
            ))}
          </div>
        </Carousel>
      )}

      {/* Indicador de progreso */}
      <div className="w-full max-w-4xl h-1 bg-muted/20 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((selectedIndex + 1) / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
