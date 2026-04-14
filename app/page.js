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

export default function Home() {
  return (
    <main className="relative z-0">
      <Navbar />
      <SplashPage />
      <Hero />
      <AboutUs />
      <BrevloSolution />
      <HowItWorks />
      <AITrapWidget />
      <ThumbnailMarquee />
      <ROICalculator />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
