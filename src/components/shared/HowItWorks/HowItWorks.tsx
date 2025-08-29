'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Search, ShoppingCart, Truck } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-8 w-8" />,
    title: 'Explora Productos',
    description: 'Navega por nuestras categorías y encuentra lo que necesitas',
    color: 'from-blue-500 to-cyan-500',
    delay: 0,
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: 'Agrega al Carrito',
    description: 'Selecciona tus productos favoritos y agrégales al carrito',
    color: 'from-green-500 to-emerald-500',
    delay: 0.2,
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Envío Express',
    description: 'Recibe tu pedido en 24-48 horas con nuestro servicio premium',
    color: 'from-purple-500 to-pink-500',
    delay: 0.4,
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: '¡Disfruta!',
    description: 'Recibe tu pedido y disfruta de la calidad que mereces',
    color: 'from-yellow-500 to-orange-500',
    delay: 0.6,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
            ¿Cómo Funciona?
          </h2>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            En solo 4 pasos simples tendrás tus productos en la puerta de tu
            casa
          </p>
        </motion.div>

        {/* Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: step.delay }}
              className="relative group h-full"
            >
              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-primary/20 z-0 transform -translate-y-1/2">
                  <div className="w-full h-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
                </div>
              )}

              <div className="relative z-10 text-center h-full flex flex-col">
                {/* Número del paso */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Icono con gradiente */}
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                >
                  {step.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {step.description}
                  </p>
                </div>
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
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <ShoppingCart className="h-5 w-5" />
            ¡Comienza a Comprar Ahora!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
