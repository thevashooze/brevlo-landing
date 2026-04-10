import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AITrapWidget from '@/components/AITrapWidget'
import BrevloSolution from '@/components/BrevloSolution'
import ThumbnailMarquee from '@/components/ThumbnailMarquee'
import ROICalculator from '@/components/ROICalculator'
import PricingSection from '@/components/PricingSection'
import Footer from '@/components/Footer'
import GlobalBackground from '@/components/GlobalBackground'

export default function Home() {
  return (
    <main className="relative z-0">
      <GlobalBackground />
      <Navbar />
      <Hero />
      <BrevloSolution />
      <AITrapWidget />
      <ThumbnailMarquee />
      <ROICalculator />
      <PricingSection />
      <Footer />
    </main>
  )
}
