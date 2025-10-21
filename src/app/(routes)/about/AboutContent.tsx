// src/app/(routes)/about/AboutContent.tsx

'use client';

import { ArrowRight, Heart, Shield, Sparkles, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutContent() {
  return (
    <main className="relative min-h-screen py-24 overflow-hidden bg-background">
      {/* Elemento decorativo superior */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-60 mb-16"></div>

      <div className="container mx-auto px-6">
        {/* Hero visual minimalista */}
        <section className="flex flex-col items-center justify-center mb-20">
          <div className="mb-8 relative w-full flex justify-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide border border-primary/20">
                <Sparkles className="h-4 w-4" />
                Nuestro equipo
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-border/20 bg-background">
              <Image
                src="/nn.jpg"
                alt="Equipo"
                width={420}
                height={220}
                className="w-[420px] h-[220px] object-cover object-center"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4">
            Sobre nosotros
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-center">
            Somos una tienda online dedicada a ofrecer productos de calidad,
            innovación y atención personalizada.
          </p>
        </section>

        {/* Misión, visión y valores en cards minimalistas */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-card border border-border rounded-xl p-8 text-center transition-all duration-300 hover:shadow-md">
            <Shield className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-3">Nuestra misión</h2>
            <p className="text-muted-foreground">
              Ofrecer productos de calidad para el hogar, el cuidado personal y
              la tecnología, brindando una experiencia de compra sencilla,
              segura y satisfactoria.
            </p>
          </div>
          <div className="flex flex-col items-center bg-card border border-border rounded-xl p-8 text-center transition-all duration-300 hover:shadow-md">
            <Star className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-3">Nuestra visión</h2>
            <p className="text-muted-foreground">
              Ser la tienda online de referencia en innovación, variedad y
              servicio al cliente en el mercado hispanohablante.
            </p>
          </div>
          <div className="flex flex-col items-center bg-card border border-border rounded-xl p-8 text-center transition-all duration-300 hover:shadow-md">
            <Heart className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-3">Nuestros valores</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>Calidad y confianza</li>
              <li>Atención personalizada</li>
              <li>Innovación constante</li>
              <li>Compromiso con el cliente</li>
            </ul>
          </div>
        </section>

        {/* Testimonios minimalistas */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Testimonios</h2>
          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
              <Users className="h-7 w-7 text-primary mb-3" />
              <p className="text-foreground mb-3">
                Excelente atención y productos de primera calidad. ¡Repetiré mi
                compra!
              </p>
              <span className="text-sm font-semibold text-primary">Ana G.</span>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
              <Users className="h-7 w-7 text-primary mb-3" />
              <p className="text-foreground mb-3">
                La entrega fue rápida y el empaque impecable. Muy recomendados.
              </p>
              <span className="text-sm font-semibold text-primary">
                Luis M.
              </span>
            </div>
          </div>
        </section>

        {/* Botón de contacto minimalista */}
        <div className="mb-16 flex justify-center">
          <Link href="mailto:contacto@tutienda.com">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Contáctanos
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-12"></div>

        {/* Redes sociales minimalistas - igual que en el footer */}
        <div className="flex justify-center gap-6">
          {/* Instagram */}
          <Link
            href="https://instagram.com"
            target="_blank"
            aria-label="Síguenos en Instagram"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              className="h-5 w-5"
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
              className="h-5 w-5"
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
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
