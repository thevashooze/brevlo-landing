'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, rotate: -4 }}
      animate={{ opacity: 1, x: 0, rotate: -2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[#1D1D1D] border-[6px] border-black overflow-hidden shadow-[12px_12px_0_#FFE600] w-full max-w-[450px]"
    >
      <div className="bg-black border-b-[6px] border-black px-4 py-3 flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-4 border-black shadow-[2px_2px_0_#000]"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400 border-4 border-black shadow-[2px_2px_0_#000]"></div>
          <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-black shadow-[2px_2px_0_#000]"></div>
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="w-full bg-[#111] border-4 border-black p-4 shadow-[4px_4px_0_#FFE600]"
        >
          <div className="w-full h-3 bg-white/10 mb-3"></div>
          <div className="w-3/4 h-3" style={{ background: '#FFE600' }}></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="w-full bg-[#111] border-4 border-black p-4 shadow-[4px_4px_0_#A033FF]"
        >
          <div className="w-full h-3 bg-white/10 mb-3"></div>
          <div className="w-1/2 h-3" style={{ background: '#A033FF' }}></div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

const TRUST = [
  { label: 'Secure Payments',         bg: '#FFE600', shadow: '6px 6px 0 #0A0A0A' },
  { label: 'Deadline Guarantee',      bg: '#D4AAFF', shadow: '6px 6px 0 #0A0A0A' },
  { label: 'Human Designers, Not AI', bg: '#ffffff', shadow: '6px 6px 0 #A033FF' },
]

export default function PricingSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pricing" ref={ref} className="section scroll-mt-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-16 lg:gap-24 justify-center"
        >

          {/* LEFT */}
          <div className="flex-1 w-full max-w-lg text-center md:text-left">
            <h2 className="font-black text-white text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase tracking-tight leading-[0.95] mb-8">
              ONE PRICE.<br />
              NO SURPRISES.<br />
              <span style={{ color: '#FFE600' }}>NO HIDDEN FEES.</span>
            </h2>
            <p className="text-black font-black text-lg mb-12 inline-block px-8 py-3 border-[6px] border-black shadow-[8px_8px_0_#FFE600] rotate-[2deg]" style={{ background: '#D4AAFF' }}>
              $20 FLAT. SAME DAY. HUMAN DESIGNED.
            </p>
            <div className="flex justify-center md:justify-start mt-10">
              {inView && <DashboardPreview />}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full max-w-[420px] flex flex-col z-20 mt-10 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, type: 'spring' }}
              className="bg-white border-[6px] border-black text-center px-8 py-12 shadow-[16px_16px_0_#FFE600] relative"
            >
              {/* Badge */}
              <div className="absolute -top-6 -right-6 border-4 border-black text-black font-black px-8 py-3 rotate-[6deg] shadow-[6px_6px_0_#0A0A0A] text-base tracking-widest" style={{ background: '#FFE600' }}>
                MOST POPULAR
              </div>

              <p className="font-black text-2xl text-black tracking-widest uppercase mb-1">
                BREVLO PREMIUM.
              </p>
              <p className="font-bold text-base text-black/40 tracking-widest uppercase mb-8">
                ONE FLAT FEE.
              </p>

              <div className="mb-10">
                <span className="font-black text-[7rem] leading-none tracking-tighter text-black" style={{ textShadow: '6px 6px 0 #FFE600' }}>
                  $20
                </span>
                <span className="block font-black text-lg tracking-widest uppercase mt-4" style={{ color: '#A033FF' }}>
                  / PER THUMBNAIL
                </span>
              </div>

              <a href="/order" className="block outline-none">
                <button className="nb-btn-yellow w-full py-5 text-xl">
                  GET STARTED NOW →
                </button>
              </a>
            </motion.div>

            {/* Trust items */}
            <div className="mt-10 flex flex-col gap-4">
              {TRUST.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 border-4 border-black px-5 py-3.5"
                  style={{ background: item.bg, boxShadow: item.shadow }}
                >
                  <div className="flex-shrink-0"><CheckIcon /></div>
                  <span className="text-black font-black tracking-wider text-base uppercase">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
