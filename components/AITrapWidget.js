'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BEFORE_IMG = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/detective%20(3).jpg'
const AFTER_IMG  = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/he%20is%20back%20travis%201.jpg'

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00CC6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function AITrapWidget() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section">
      <div className="container">

        {/* Heading — one line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="label-tag mb-5 inline-block">AI vs Human</span>
          <h2
            className="font-black text-white uppercase leading-[0.95] mb-4"
            style={{ fontSize: 'clamp(2.2rem,5.5vw,4.5rem)' }}
          >
            AI IS KILLING <span style={{ color: '#FF3333' }}>YOUR CTR.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Same title. Different designer. The gap is brutal.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] items-stretch gap-0">

          {/* AI side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="border border-white/10 overflow-hidden cursor-default"
            style={{ background: '#0D0D0D' }}
          >
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <img
                src={BEFORE_IMG}
                alt="AI-generated thumbnail"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.5) brightness(0.55)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 0%, transparent 60%)' }} />
            </div>
            <div className="px-6 py-5">
              <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mb-3">AI-Generated</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-black leading-none" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#FF3333' }}>2.1%</span>
                <span className="text-white/25 font-bold text-sm uppercase tracking-widest pb-1">CTR</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-white/8">
                <IconX />
                <span className="text-white/35 font-bold text-xs uppercase tracking-wider">Generic. Forgettable. Unclickable.</span>
              </div>
            </div>
          </motion.div>

          {/* VS divider — visible with press animation */}
          <div className="flex lg:flex-col items-center justify-center gap-0 py-6 lg:py-0">
            <div className="flex-1 w-full lg:w-px h-px lg:h-full bg-white/10" />
            <motion.div
              className="flex-shrink-0 font-black text-xs tracking-[0.3em] px-4 py-2.5 mx-3 lg:mx-0 lg:my-4 cursor-pointer select-none"
              style={{
                border: '3px solid #0A0A0A',
                background: '#FFE600',
                color: '#0A0A0A',
                boxShadow: '0px 6px 0 #0A0A0A',
              }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              whileHover={{
                x: 0, y: 6,
                boxShadow: '0px 0px 0 #0A0A0A',
                transition: { duration: 0.1, ease: 'easeOut' },
              }}
            >
              VS
            </motion.div>
            <div className="flex-1 w-full lg:w-px h-px lg:h-full bg-white/10" />
          </div>

          {/* Brevlo side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="border border-white/10 overflow-hidden cursor-default"
            style={{ background: '#0D0D0D' }}
          >
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <img
                src={AFTER_IMG}
                alt="Brevlo quality thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 0%, transparent 60%)' }} />
            </div>
            <div className="px-6 py-5">
              <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest mb-3">Brevlo Quality</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-black leading-none" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#00CC6A' }}>7.9%</span>
                <span className="text-white/25 font-bold text-sm uppercase tracking-widest pb-1">CTR</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-white/8">
                <IconCheck />
                <span className="font-bold text-xs uppercase tracking-wider" style={{ color: '#00CC6A' }}>Human. Strategic. Clickable.</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Impact line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mt-6 text-center py-6 border-t border-white/8"
        >
          <p className="font-black text-white uppercase leading-none" style={{ fontSize: 'clamp(1.6rem,4vw,3rem)' }}>
            That's{' '}
            <span style={{ color: '#FFE600' }}>3.8×</span>
            {' '}more clicks.{' '}
            <span className="text-white/30">Same video.</span>
          </p>
          <p className="text-white/25 font-bold text-xs uppercase tracking-widest mt-3">Based on real client results</p>
        </motion.div>

      </div>
    </section>
  )
}
