import Navbar from '@/components/Navbar'
import SplashPage from '@/components/SplashPage'
import Hero from '@/components/Hero'
import AboutUs from '@/components/AboutUs'
import BrevloSolution from '@/components/BrevloSolution'
import HowItWorks from '@/components/HowItWorks'
import AITrapWidget from '@/components/AITrapWidget'
import ThumbnailMarquee from '@/components/ThumbnailMarquee'
import ROICalculator from '@/components/ROICalculator'
import Testimonials from '@/components/Testimonials'
import PricingSection from '@/components/PricingSection'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <main className="relative z-0">
      <Navbar />
      <SplashPage />
      <Hero />
      <ScrollReveal delay={0.05}><AboutUs /></ScrollReveal>
      <ScrollReveal><BrevloSolution /></ScrollReveal>
      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><AITrapWidget /></ScrollReveal>
      <ScrollReveal><ThumbnailMarquee /></ScrollReveal>
      <ScrollReveal><Testimonials /></ScrollReveal>
      <ScrollReveal><ROICalculator /></ScrollReveal>
      <ScrollReveal><PricingSection /></ScrollReveal>
      <ScrollReveal><FAQ /></ScrollReveal>
      <CTASection />
      <Footer />
    </main>
  )
}
