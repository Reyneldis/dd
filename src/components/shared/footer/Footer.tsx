'use client';

import { motion } from 'framer-motion';
import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import Logo from '../Logo/Logo';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <footer className="relative z-10 border-t border-border/40 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Logo y descripción */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Logo />
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              Tu tienda online de confianza con productos de calidad y entrega
              express. Hacemos que tus compras sean rápidas, seguras y
              convenientes.
            </motion.p>

            {/* Información de contacto */}
            <motion.div variants={itemVariants} className="space-y-2">
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>info@deliveryexpress.com</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>Ciudad, País</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3
              variants={itemVariants}
              className="text-lg font-semibold text-foreground"
            >
              Enlaces Rápidos
            </motion.h3>
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/products', label: 'Productos' },
                { href: '/about', label: 'Sobre Nosotros' },
                { href: '/contact', label: 'Contacto' },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
                  >
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Categorías */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3
              variants={itemVariants}
              className="text-lg font-semibold text-foreground"
            >
              Categorías
            </motion.h3>
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              {[
                {
                  href: '/categories/electrodomesticos',
                  label: 'Electrodomésticos',
                },
                { href: '/categories/aseos', label: 'Aseo y Hogar' },
                { href: '/categories/comida', label: 'Alimentación' },
                { href: '/products', label: 'Ver Todos' },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
                  >
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Redes sociales */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3
              variants={itemVariants}
              className="text-lg font-semibold text-foreground"
            >
              Síguenos
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground"
            >
              Mantente conectado con nosotros para las últimas ofertas y
              novedades.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(social => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  variants={socialVariants}
                  whileHover={{
                    scale: 1.2,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Línea divisoria */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
        >
          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span>© 2025 Delivery Express. Hecho con</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Términos
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
