'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BEFORE_IMG = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/detective%20(3).jpg'
const AFTER_IMG  = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/he%20is%20back%20travis%201.jpg'

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CC6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-rocket text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
            AI THUMBNAILS <span style={{ color: '#FFE600' }}>KILL YOUR CTR</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Same title. Different designer. The gap is brutal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl border-4 border-black overflow-hidden shadow-[20px_20px_0_#FFE600]"
        >
          {/* Tab bar */}
          <div className="bg-white border-b-4 border-black">
            <div className="px-6 pt-5 flex items-end">
              <div
                className="bg-[#FFE600] border-4 border-b-0 border-black px-6 py-2.5 font-black text-black text-xs uppercase tracking-widest"
                style={{ borderRadius: '8px 8px 0 0' }}
              >
                Your Video Title
              </div>
              <div className="flex-1 border-b-4 border-black" />
            </div>
            <div className="px-8 py-6">
              <p className="text-black font-black text-2xl sm:text-4xl tracking-wide uppercase">
                The Untold Story of Crypto
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr]" style={{ background: '#0A0A0A' }}>

            {/* AI side */}
            <div className="flex flex-col">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img src={BEFORE_IMG} alt="AI thumbnail" className="w-full h-full object-cover opacity-55" />
                <div className="absolute top-4 left-4 bg-black border-2 border-black rounded-full w-9 h-9 flex items-center justify-center shadow-[2px_2px_0_#FF3333]">
                  <IconX />
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t-4 border-white/10">
                <span className="text-white font-black text-sm uppercase tracking-wider">AI-Generated Slop</span>
                <span className="font-black text-base" style={{ color: '#FF3333' }}>↓ 2.1% CTR</span>
              </div>
            </div>

            {/* Center badge */}
            <div className="flex items-center justify-center bg-[#0A0A0A] border-x-4 border-white/10 px-6 py-6 sm:py-0">
              <div className="bg-[#FFE600] border-4 border-black px-5 py-3 font-black text-black text-sm tracking-widest shadow-[4px_4px_0_#A033FF] whitespace-nowrap">
                CTR LIFT →
              </div>
            </div>

            {/* Brevlo side */}
            <div className="flex flex-col">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img src={AFTER_IMG} alt="Brevlo thumbnail" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white border-2 border-black rounded-full w-9 h-9 flex items-center justify-center shadow-[2px_2px_0_#00CC6A]">
                  <IconCheck />
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t-4 border-white/10">
                <span className="font-black text-sm uppercase tracking-wider" style={{ color: '#D4AAFF' }}>Brevlo Quality</span>
                <span className="font-black text-base" style={{ color: '#00CC6A' }}>↑ 7.9% CTR</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
