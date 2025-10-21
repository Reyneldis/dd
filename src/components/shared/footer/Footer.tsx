'use client';

import { motion } from 'framer-motion';
import {
  ChevronRight,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import Logo from '../Logo/Logo';

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-border transition-colors duration-300">
      {/* Elemento decorativo superior */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-60"></div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Sección principal - Logo y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="flex items-center gap-2">
              <Logo />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Tu tienda online de confianza. Productos de calidad con entrega
              express, diseñados para simplificar tu vida.
            </p>

            {/* Información de contacto minimalista */}
            <div className="space-y-2 pt-4">
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>+1 (555) 123-4567</span>
              </a>
              <a
                href="mailto:info@deliveryexpress.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>info@deliveryexpress.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Ciudad, País</span>
              </div>
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <h3 className="text-sm font-semibold text-foreground tracking-wide mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-primary rounded-full"></span>
              Explorar
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/products', label: 'Productos' },
                { href: '/about', label: 'Sobre Nosotros' },
                { href: '/contact', label: 'Contacto' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categorías */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <h3 className="text-sm font-semibold text-foreground tracking-wide mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-secondary rounded-full"></span>
              Categorías
            </h3>
            <ul className="space-y-3">
              {[
                {
                  href: '/categories/electrodomesticos',
                  label: 'Electrodomésticos',
                },
                { href: '/categories/aseos', label: 'Aseo y Hogar' },
                { href: '/categories/comida', label: 'Alimentación' },
                { href: '/products', label: 'Ver Todos' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Separador con animación */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-12 origin-left"
        />

        {/* Footer inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between px-8 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span>© {new Date().getFullYear()} Delivery Express.</span>
            <span className="hidden sm:inline">
              Todos los derechos reservados
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              <Heart className="h-4 w-4 text-destructive fill-current" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Términos
            </Link>

            {/* Redes sociales minimalistas */}
            <div className="flex items-center gap-3 ml-2 pl-6 border-l border-border">
              <motion.a
                href="#"
                aria-label="Síguenos en Instagram"
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </motion.a>
              <motion.a
                href="#"
                aria-label="Síguenos en Facebook"
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-4 w-4" strokeWidth={1.5} />
              </motion.a>

              <motion.a
                href="#"
                aria-label="Síguenos en X"
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
