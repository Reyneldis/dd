'use client';

import CarouselTextBanner from '@/components/shared/carousel-text-banner';
import Categories from '@/components/shared/categories';
import FeaturedProducts from '@/components/shared/FeaturedProducts/FeaturedProducts';
import Footer from '@/components/shared/footer/Footer';
import Hero from '@/components/shared/Hero/Hero';
import HowItWorks from '@/components/shared/HowItWorks/HowItWorks';
import PremiumFeatures from '@/components/shared/PremiumFeatures/PremiumFeatures';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import StatsCounter from '@/components/shared/StatsCounter/StatsCounter';
import Testimonials from '@/components/shared/Testimonials/Testimonials';
import { motion, Variants } from 'framer-motion';

// --- Define las variantes y añade la aserción de tipo 'as Variants' ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.3,
    },
  },
} as Variants;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
} as Variants;

export default function Home() {
  return (
    <>
      <motion.main
        className="flex flex-col items-center w-full min-h-screen mx-auto max-w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <CarouselTextBanner />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Hero />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-8 gap-8"
        >
          <ScrollReveal delay={0.1} animationType="fadeInUpBlur">
            <StatsCounter />
          </ScrollReveal>

          <ScrollReveal delay={0.2} animationType="fadeInUpBlur">
            <Categories />
          </ScrollReveal>

          <ScrollReveal delay={0.3} animationType="fadeInUpBlur">
            <HowItWorks />
          </ScrollReveal>

          <ScrollReveal delay={0.4} animationType="fadeInUpBlur">
            <FeaturedProducts />
          </ScrollReveal>

          <ScrollReveal delay={0.5} animationType="fadeInUpBlur">
            <PremiumFeatures />
          </ScrollReveal>

          <ScrollReveal delay={0.6} animationType="fadeInUpBlur">
            <Testimonials />
          </ScrollReveal>
        </motion.div>
      </motion.main>
      <Footer />
    </>
  );
}
