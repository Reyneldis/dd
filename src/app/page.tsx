import CarouselTextBanner from '@/components/shared/carousel-text-banner';
import Categories from '@/components/shared/categories';
import FeaturedProducts from '@/components/shared/FeaturedProducts/FeaturedProducts';
import Hero from '@/components/shared/Hero/Hero';
import HowItWorks from '@/components/shared/HowItWorks/HowItWorks';
import PremiumFeatures from '@/components/shared/PremiumFeatures/PremiumFeatures';
import StatsCounter from '@/components/shared/StatsCounter/StatsCounter';
import Testimonials from '@/components/shared/Testimonials/Testimonials';

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen mx-auto max-w-full">
      <CarouselTextBanner />
      <Hero />
      <div className="flex flex-col items-center mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-8 gap-8">
        <StatsCounter />
        <Categories />
        <HowItWorks />
        <FeaturedProducts />
        <PremiumFeatures />
        <Testimonials />
      </div>
    </main>
  );
}
