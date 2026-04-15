'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STATS = [
  { n: '500+',  label: 'Delivered' },
  { n: '$20',   label: 'Flat Fee' },
  { n: '< 24h', label: 'Turnaround' },
  { n: '4.9 ★', label: 'Rating' },
]

export default function Hero() {
  const sectionRef = useRef(null)

  // Scroll-in + scroll-out animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.78, 1.0], [0, 1, 1, 0])
  const y       = useTransform(scrollYProgress, [0, 0.12, 0.78, 1.0], [28, 0, 0, -52])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-6 flex flex-col items-center text-center pb-10"
      >
        <h1
          className="font-rocket text-white leading-[0.88] mb-5"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
        >
          STOP LOSING<br />
          <span style={{ color: '#FFE600' }}>CLICKS.</span>
        </h1>

        <p className="text-white/55 font-bold text-base sm:text-lg uppercase tracking-widest mb-10 max-w-md">
          Maximum CTR. Same-day delivery. $20 flat.
        </p>

        {/* Stats — float up on hover, instant return */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="border-2 border-white/25 p-3 text-center cursor-default"
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <p
                className="font-bold text-xl sm:text-2xl leading-none mb-0.5 tracking-tight"
                style={{ color: '#FFE600' }}
              >
                {s.n}
              </p>
              <p className="text-white/45 font-bold text-[10px] uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
