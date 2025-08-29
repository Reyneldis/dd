'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Clock,
  Heart,
  Shield,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Envío Ultra Rápido',
    description: 'Recibe tu pedido en 24-48 horas con nuestro servicio express',
    color: 'from-yellow-500 to-orange-500',
    delay: 0,
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Compra 100% Segura',
    description: 'Tus datos y pagos están protegidos con la máxima seguridad',
    color: 'from-green-500 to-emerald-500',
    delay: 0.1,
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: 'Soporte 24/7',
    description: 'Estamos disponibles para ayudarte en cualquier momento',
    color: 'from-blue-500 to-cyan-500',
    delay: 0.2,
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: 'Productos Premium',
    description: 'Solo trabajamos con las mejores marcas y productos',
    color: 'from-purple-500 to-pink-500',
    delay: 0.3,
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Entrega a Domicilio',
    description: 'Llevamos tus productos hasta la puerta de tu casa',
    color: 'from-indigo-500 to-purple-500',
    delay: 0.4,
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Atención Personalizada',
    description: 'Cada cliente es especial para nosotros',
    color: 'from-red-500 to-pink-500',
    delay: 0.5,
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Garantía de Calidad',
    description: 'Todos nuestros productos tienen garantía de satisfacción',
    color: 'from-amber-500 to-yellow-500',
    delay: 0.6,
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Comunidad Feliz',
    description: 'Más de 5000 clientes satisfechos nos recomiendan',
    color: 'from-teal-500 to-cyan-500',
    delay: 0.7,
  },
];

export default function PremiumFeatures() {
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
            <Star className="h-5 w-5 animate-pulse" />
            Ventajas Exclusivas
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-4">
            ¿Por Qué Elegirnos?
          </h2>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Descubre las ventajas que nos hacen únicos en el mercado
          </p>
        </motion.div>

        {/* Grid de características */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              className="group relative h-full"
            >
              <div className="relative p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
                {/* Icono con gradiente */}
                <div
                  className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                >
                  {feature.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm flex-1">
                    {feature.description}
                  </p>
                </div>

                {/* Efecto hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <Star className="h-5 w-5" />
            ¡Únete a Nuestra Comunidad!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
