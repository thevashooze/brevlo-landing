import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ThumbnailMarquee from '@/components/ThumbnailMarquee'
import About from '@/components/About'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ThumbnailMarquee />
      <About />
      <ContactForm />
      <Footer />
    </main>
  )
}
