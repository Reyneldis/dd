'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Moved constant data outside the component to prevent re-declaration on every render.
const HERO_DATA = {
  title: 'Todo para tu hogar, en un solo lugar',
  description:
    'Comida fresca, electrodomésticos y productos de aseo. Hacé tu pedido y recibilo sin costo de envío.',
  image: '/img/img1.webp',
  cta: 'Comprar ahora',
  secondaryCta: 'Ver ofertas',
};

export default function Hero() {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, -60]);
  const yText = useTransform(scrollY, [0, 500], [0, -20]);
  const gradientRotate = useTransform(scrollY, [0, 500], [0, 90]);

  return (
    // La sección principal sigue siendo transparente para que se vea el fondo
    <section className="relative flex items-center justify-center py-16 px-4 max-w-full sm:py-20 overflow-hidden min-h-screen">
      {/* Fondo con gradiente dinámico - se verá a través de la tarjeta de cristal */}
      <motion.div
        style={{ rotate: gradientRotate }}
        className="absolute inset-0 z-0"
      >
        <div
          className="w-[200%] h-[200%] -top-1/2 -left-1/2 "
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, #10b981 0%, #f59e0b 25%, #10b981 50%, #f59e0b 75%, #10b981 100%)',
            opacity: 0.15,
          }}
        />
      </motion.div>

      {/* 
        CAMBIO CLAVE: 
        Este es el contenedor de "cristal" que hace el texto legible 
        y le da profundidad a la sección para que el navbar pueda desenfocarlo.
      */}
      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-background/80 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            {/* --- TEXTO --- */}
            <motion.div
              style={{ y: yText }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center md:items-start gap-4 sm:gap-6 md:gap-8 w-full"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700"
              >
                {HERO_DATA.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg text-center md:text-left"
              >
                {HERO_DATA.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 mt-4"
              >
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/40 transition"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2" aria-hidden="true">
                      🛒
                    </span>
                    {HERO_DATA.cta}
                  </motion.div>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-amber-500 text-amber-600 font-semibold hover:bg-amber-500 hover:text-white transition"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2" aria-hidden="true">
                      🏷️
                    </span>
                    {HERO_DATA.secondaryCta}
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* --- IMAGEN + GLOW --- */}
            <motion.div
              style={{ y: yImage }}
              initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
              className="flex mt-10 justify-center md:justify-end w-full"
            >
              <motion.div
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative group w-fit"
              >
                <motion.div
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 blur-2xl"
                />
                <Image
                  src={HERO_DATA.image}
                  alt="Productos del hogar"
                  width={480}
                  height={480}
                  priority
                  placeholder="blur"
                  blurDataURL="/img/asaaa.webp"
                  className="relative z-10 object-cover rounded-3xl shadow-2xl w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
