'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BEFORE = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/living%20in%20poorest%20city%20no%20text.jpg'
const AFTER  = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/robert%20openhiemer.jpg'

export default function BrevloSolution() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section scroll-mt-20">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-rocket text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
            THE DIFFERENCE IS <span style={{ color: '#FFE600' }}>REAL.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Same video. Different thumbnail. Completely different result.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Main comparison card */}
          <div className="rounded-2xl border-4 border-black overflow-hidden shadow-[20px_20px_0_#FFE600]" style={{ background: '#0A0A0A' }}>
            <div className="flex flex-col xl:flex-row">

              {/* BEFORE */}
              <div className="flex-1 relative group">
                <div className="relative" style={{ aspectRatio: '16/9' }}>
                  <img src={BEFORE} alt="Before" className="w-full h-full object-cover opacity-55" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />
                  <div className="absolute top-5 left-5 bg-white text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0_#FF6B35]">
                    Before
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-black text-xs uppercase tracking-widest mb-1.5" style={{ color: '#FF6B35' }}>Cheap Freelancer</p>
                    <p className="text-white font-black text-xl uppercase tracking-wide leading-tight">Missing Deadlines<br />& Context</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 border-t-2 border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-white/40 font-black text-xs uppercase tracking-widest">Slow & Unreliable</span>
                </div>
              </div>

              {/* ARROW divider */}
              <div className="flex items-center justify-center px-8 py-6 xl:py-0 flex-shrink-0" style={{ background: '#FFE600' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* AFTER */}
              <div className="flex-1 relative group">
                <div className="relative" style={{ aspectRatio: '16/9' }}>
                  <img src={AFTER} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                  <div className="absolute top-5 right-5 font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0_#FFE600]" style={{ background: '#A033FF', color: '#fff' }}>
                    After
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-black text-xs uppercase tracking-widest mb-1.5" style={{ color: '#D4AAFF' }}>Brevlo Premium</p>
                    <p className="text-white font-black text-xl uppercase tracking-wide leading-tight">Flawless<br />Execution</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 border-t-2 border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#00CC6A' }} />
                  <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#FFE600' }}>Same-Day Turnaround</span>
                </div>
              </div>

            </div>
          </div>

          {/* Tagline */}
          <div className="text-center mt-10">
            <span className="inline-block bg-white text-black font-black text-base uppercase tracking-wide px-8 py-4 border-4 border-black shadow-[6px_6px_0_#FFE600]">
              Investment: <span style={{ color: '#A033FF' }}>$20.</span>&nbsp;&nbsp;Returns: <span style={{ color: '#00CC6A' }}>Priceless.</span>
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
