// app/page.tsx
import CarouselTextBanner from '@/components/shared/carousel-text-banner';
import Categories from '@/components/shared/categories';
import FeaturedProducts from '@/components/shared/FeaturedProducts/FeaturedProducts';
import Hero from '@/components/shared/Hero/Hero';
import HowItWorks from '@/components/shared/HowItWorks/HowItWorks';
import PremiumFeatures from '@/components/shared/PremiumFeatures/PremiumFeatures';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import StatsCounter from '@/components/shared/StatsCounter/StatsCounter';
import Testimonials from '@/components/shared/Testimonials/Testimonials';

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen mx-auto max-w-full">
      <CarouselTextBanner />
      <Hero />
      <div className="flex flex-col items-center mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-8 gap-8">
        {/* --- APLICANDO EL NUEVO EFECTO "MÁGICO" CON BLUR --- */}
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
      </div>
    </main>
  );
}
