'use client'

import { motion } from 'framer-motion'

const STATS = [
  { n: '500+',  label: 'Delivered' },
  { n: '$20',   label: 'Flat Fee' },
  { n: '< 24h', label: 'Turnaround' },
  { n: '4.9★',  label: 'Rating' },
]

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 flex flex-col items-center text-center pt-24 pb-10">

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-rocket text-white leading-[0.88] mb-5"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
        >
          STOP LOSING<br />
          <span style={{ color: '#FFE600' }}>CLICKS.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/60 font-bold text-base sm:text-lg uppercase tracking-widest mb-10 max-w-md"
        >
          Maximum CTR. Same-day delivery. $20 flat.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl"
        >
          {STATS.map((s, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-sm border-2 border-white/20 p-3 text-center">
              <p className="font-rocket text-[#FFE600] text-2xl sm:text-3xl leading-none mb-0.5">{s.n}</p>
              <p className="text-white/50 font-bold text-[10px] uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
