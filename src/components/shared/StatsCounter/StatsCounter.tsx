'use client';

import { motion } from 'framer-motion';
import { Package, Star, Truck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  {
    icon: <Users className="h-8 w-8" />,
    value: 1500,
    label: 'Clientes Felices',
    suffix: '+',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Package className="h-8 w-8" />,
    value: 4500,
    label: 'Productos Entregados',
    suffix: '+',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Star className="h-8 w-8" />,
    value: 4.8,
    label: 'Calificación Promedio',
    suffix: '/5',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <Truck className="h-8 w-8" />,
    value: 48,
    label: 'Horas de Entrega',
    suffix: 'h',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function StatsCounter() {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 },
    );

    const element = document.getElementById('stats-counter');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }

        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = Math.floor(current);
          return newCounters;
        });
      }, duration / steps);
    });
  };

  return (
    <section id="stats-counter" className="relative py-16 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl mt-4 md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
            Números que Hablan por Sí Solos
          </h2>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Miles de clientes confían en nosotros para sus compras diarias
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group h-full"
            >
              <div className="relative h-full flex flex-col">
                {/* Icono con gradiente */}
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                >
                  {stat.icon}
                </div>

                {/* Contador animado */}
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                  key={counters[index]}
                  initial={{ scale: 1.2, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {counters[index]}
                  <span className="text-primary">{stat.suffix}</span>
                </motion.div>

                <p className="text-sm md:text-base text-muted-foreground font-medium flex-1">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
