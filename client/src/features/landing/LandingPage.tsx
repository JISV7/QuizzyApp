import { CallToAction } from '@/features/landing/main/CallToAction';
import { Features } from '@/features/landing/main/Features';
import { Footer } from '@/features/landing/footer/Footer';
import { Header } from '@/features/landing/header/Header';
import { Hero } from '@/features/landing/main/Hero';
import { HowItWorks } from '@/features/landing/main/HowItWorks';
import { Testimonials } from '@/features/landing/main/Testimonials';

export const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
};