'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const ORDER_FLOW = ['/order', '/requirements', '/payment']

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing',   href: '#pricing'   },
  { label: 'Portfolio', href: '#portfolio'  },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isOrderFlow = ORDER_FLOW.includes(pathname)

  // BREVLO logo fades in as big splash BREVLO scrolls out
  const logoOpacity = useTransform(scrollY, [250, 500], [0, 1])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4">

        {/* Left: burger + logo */}
        <div className="flex items-center gap-3">
          {/* Burger — always visible */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer flex-shrink-0"
            aria-label="Open menu"
          >
            <span className="block w-6 h-[3px] bg-white" />
            <span className="block w-6 h-[3px] bg-white" />
            <span className="block w-6 h-[3px] bg-white" />
          </button>

          {/* BREVLO — fades in on scroll */}
          <motion.span
            className="font-rocket text-2xl tracking-widest text-white"
            style={{ opacity: logoOpacity }}
          >
            BREVLO
          </motion.span>
        </div>

        {/* Right: ORDER NOW — hidden on order flow pages */}
        {!isOrderFlow && (
          <a href="/order">
            <button className="nb-btn-yellow px-5 py-2 text-xs tracking-widest">
              ORDER NOW →
            </button>
          </a>
        )}
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-[150]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 left-0 h-full w-72 z-[200] flex flex-col"
              style={{ background: '#0A0A0A', borderRight: '4px solid #FFE600' }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '4px solid rgba(255,255,255,0.08)' }}>
                <span className="font-rocket text-white text-xl tracking-widest">BREVLO</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-white/50 hover:text-white font-black text-xl leading-none cursor-pointer"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col p-6 gap-1 flex-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                    className="font-black text-white text-lg uppercase tracking-widest px-4 py-3 border-2 border-transparent hover:border-[#FFE600] hover:text-[#FFE600] transition-colors duration-150"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="p-6" style={{ borderTop: '4px solid rgba(255,255,255,0.08)' }}>
                <a href="/order" onClick={() => setMenuOpen(false)}>
                  <button className="nb-btn-yellow w-full py-3 text-sm tracking-widest">
                    ORDER NOW →
                  </button>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
