import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Users, Star, Shield, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen py-24 overflow-hidden bg-background/80">
      {/* Blobs decorativos premium */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>

      {/* Hero visual */}
      <section className="relative z-10 flex flex-col items-center justify-center mb-16">
        <div className="mb-8 relative w-full flex justify-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground text-base font-bold shadow-lg animate-fade-in">
              <Sparkles className="h-5 w-5 animate-bounce" />
              Nuestro equipo
            </span>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
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
        <h1 className="text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient mb-4">
          Sobre nosotros
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-center mb-2">
          Somos una tienda online premium dedicada a ofrecer productos de
          calidad, innovación y atención personalizada.
        </p>
      </section>

      {/* Misión, visión y valores en cards premium */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/20 p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <Shield className="h-8 w-8 text-primary mb-3" />
          <h2 className="text-2xl font-bold mb-2">Nuestra misión</h2>
          <p className="text-base text-muted-foreground">
            Ofrecer productos de calidad para el hogar, el cuidado personal y la
            tecnología, brindando una experiencia de compra sencilla, segura y
            satisfactoria.
          </p>
        </div>
        <div className="flex flex-col items-center bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/20 p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <Star className="h-8 w-8 text-primary mb-3" />
          <h2 className="text-2xl font-bold mb-2">Nuestra visión</h2>
          <p className="text-base text-muted-foreground">
            Ser la tienda online de referencia en innovación, variedad y
            servicio al cliente en el mercado hispanohablante.
          </p>
        </div>
        <div className="flex flex-col items-center bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/20 p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <Heart className="h-8 w-8 text-primary mb-3" />
          <h2 className="text-2xl font-bold mb-2">Nuestros valores</h2>
          <ul className="list-disc list-inside text-base text-muted-foreground text-left mx-auto max-w-xs">
            <li>Calidad y confianza</li>
            <li>Atención personalizada</li>
            <li>Innovación constante</li>
            <li>Compromiso con el cliente</li>
          </ul>
        </div>
      </section>

      {/* Testimonios premium */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          Testimonios
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/20 p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <Users className="h-7 w-7 text-primary mb-2" />
            <p className="text-lg text-foreground font-medium mb-2">
              Excelente atención y productos de primera calidad. ¡Repetiré mi
              compra!
            </p>
            <span className="text-sm font-semibold text-primary mt-2">
              Ana G.
            </span>
          </div>
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/20 p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <Users className="h-7 w-7 text-primary mb-2" />
            <p className="text-lg text-foreground font-medium mb-2">
              La entrega fue rápida y el empaque impecable. Muy recomendados.
            </p>
            <span className="text-sm font-semibold text-primary mt-2">
              Luis M.
            </span>
          </div>
        </div>
      </section>

      {/* Botón de contacto premium */}
      <div className="mb-12 flex justify-center">
        <Link href="mailto:contacto@tutienda.com">
          <button className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">
            Contáctanos
            <ArrowRight className="h-5 w-5" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
      </div>

      {/* Redes sociales premium */}
      <div className="flex justify-center space-x-8 mb-4">
        <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
          <svg
            className="w-8 h-8 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
          </svg>
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          aria-label="Instagram"
        >
          <svg
            className="w-8 h-8 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.334 3.374C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.612.06 1.282.354 2.394 1.334 3.374.98.98 2.092 1.274 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.06 2.394-.354 3.374-1.334.98-.98 1.274-2.092 1.334-3.374.059-1.28.072-1.689.072-7.612 0-5.923-.013-6.332-.072-7.612-.06-1.282-.354-2.394-1.334-3.374-.98-.98-2.092-1.274-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
        </Link>
        <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
          <svg
            className="w-8 h-8 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
