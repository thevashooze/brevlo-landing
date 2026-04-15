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

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="label-tag mb-5 inline-block">Real Results</span>
          <h2
            className="font-black text-white uppercase leading-[0.95] mb-4"
            style={{ fontSize: 'clamp(2.4rem,6vw,5rem)' }}
          >
            THE DIFFERENCE IS{' '}
            <span style={{ color: '#FFE600' }}>REAL.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Same video. Different thumbnail. Completely different result.
          </p>
        </motion.div>

        {/* Side-by-side comparison — always horizontal on md+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_52px_1fr] overflow-hidden border border-white/10">

          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <img
                src={BEFORE}
                alt="Generic freelancer thumbnail"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.35) brightness(0.55)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.1) 55%, transparent 100%)' }}
              />
              <div className="absolute top-5 left-5">
                <span
                  className="font-black text-[10px] uppercase tracking-widest px-3 py-1.5"
                  style={{ color: '#FF3333', border: '1px solid rgba(255,51,51,0.3)', background: 'rgba(255,51,51,0.08)' }}
                >
                  Generic Freelancer
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-7 py-6">
                <div className="font-black leading-none" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#FF3333' }}>
                  2.1%
                </div>
                <div className="text-white/35 font-bold text-xs uppercase tracking-widest mt-1">Average CTR</div>
              </div>
            </div>
            <div className="px-7 py-4 flex items-center gap-3 border-t border-white/8" style={{ background: '#0D0D0D' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF3333] flex-shrink-0" />
              <span className="text-white/30 font-bold text-xs uppercase tracking-widest">Missed deadlines. No context.</span>
            </div>
          </motion.div>

          {/* Arrow divider — desktop only */}
          <div
            className="hidden lg:flex flex-col items-center justify-center border-x border-black/20"
            style={{ background: '#FFE600' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="relative border-t lg:border-t-0 border-white/10"
          >
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <img
                src={AFTER}
                alt="Brevlo quality thumbnail"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 60%)' }}
              />
              <div className="absolute top-5 right-5">
                <span
                  className="font-black text-[10px] uppercase tracking-widest px-3 py-1.5"
                  style={{ color: '#00CC6A', border: '1px solid rgba(0,204,106,0.3)', background: 'rgba(0,204,106,0.08)' }}
                >
                  Brevlo Quality
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-7 py-6">
                <div className="font-black leading-none" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#00CC6A' }}>
                  7.9%
                </div>
                <div className="text-white/35 font-bold text-xs uppercase tracking-widest mt-1">With Brevlo</div>
              </div>
            </div>
            <div className="px-7 py-4 flex items-center gap-3 border-t border-white/8" style={{ background: '#0D0D0D' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00CC6A' }} />
              <span className="font-bold text-xs uppercase tracking-widest" style={{ color: '#00CC6A' }}>Same-day. Flawless execution.</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom insight bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-7 py-5 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.025)' }}
        >
          <div>
            <p className="text-white/25 font-bold text-[10px] uppercase tracking-widest mb-1">Average performance difference</p>
            <p className="font-black text-white text-lg uppercase tracking-wide">
              3.8× more clicks.{' '}
              <span style={{ color: '#FFE600' }}>Same video.</span>
            </p>
          </div>
          <a href="/order" className="flex-shrink-0">
            <button className="nb-btn-yellow px-8 py-3 text-sm tracking-widest">ORDER NOW →</button>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
