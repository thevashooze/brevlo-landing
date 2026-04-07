'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,10,11,0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <span className="text-base font-semibold tracking-[0.25em] text-white uppercase">
        BREVLO
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => scrollTo('portfolio')}
          className="px-5 py-2 text-sm font-medium tracking-wide text-gray-400 rounded-full transition-all duration-200 hover:text-white">
          Portfolio
        </button>
        <button
          onClick={() => scrollTo('about')}
          className="px-5 py-2 text-sm font-medium tracking-wide text-gray-400 rounded-full transition-all duration-200 hover:text-white">
          About
        </button>
        <button
          onClick={() => scrollTo('contact')}
          className="ml-2 px-5 py-2 text-sm font-semibold tracking-wide text-white rounded-full transition-all duration-200 hover:opacity-85"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
          Contact
        </button>
      </div>
    </motion.nav>
  )
}
