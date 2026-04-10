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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 transition-all duration-300 border-b-[6px] ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-black' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-2xl tracking-widest text-white uppercase" style={{ textShadow: '2px 2px 0 #A033FF' }}>
          BREVLO
        </span>
      </div>

      <a href="/order" className="group">
        <button
          className="bg-white border-4 border-black px-5 py-2 font-black text-black text-xs uppercase tracking-widest shadow-[4px_4px_0_#A033FF] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0_#A033FF] transition-all"
        >
          GET STARTED →
        </button>
      </a>
    </nav>
  )
}
