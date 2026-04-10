'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* Small dashboard snapshot for Context */
function DashboardPreview() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20, rotate: -4 }}
      animate={{ opacity: 1, x: 0, rotate: -2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[#1D1D1D] rounded-xl border-[6px] border-black overflow-hidden shadow-[12px_12px_0_#000] w-full max-w-[450px]"
    >
      <div className="bg-[#000] border-b-[6px] border-black px-4 py-3 flex items-center gap-3">
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
            className="w-full bg-[#111] border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_#000]"
         >
            <div className="w-full h-3 bg-white/20 rounded-md mb-3"></div>
            <div className="w-3/4 h-3 bg-[#A033FF] rounded-md"></div>
         </motion.div>
         <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="w-full bg-[#111] border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_#000]"
         >
            <div className="w-full h-3 bg-white/20 rounded-md mb-3"></div>
            <div className="w-1/2 h-3 bg-[#A033FF] rounded-md"></div>
         </motion.div>
      </div>
    </motion.div>
  )
}

const TRUST = [
  { icon: '✓', label: 'Secure Payments',         bg: 'bg-white', text: 'text-black', shadow: 'shadow-[6px_6px_0_#22c55e]' },
  { icon: '✓', label: 'Deadline Guarantee',      bg: 'bg-[#EFC5FF]', text: 'text-black', shadow: 'shadow-[6px_6px_0_#000]' },
  { icon: '🚀', label: 'Human Designers, Not AI', bg: 'bg-white', text: 'text-black', shadow: 'shadow-[6px_6px_0_#A033FF]' },
]

export default function PricingSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative w-full py-16 px-4 overflow-hidden mb-10 z-10">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-16 lg:gap-24 justify-center"
        >
          {/* ── LEFT: Heading + dashboard preview ── */}
          <div className="flex-1 w-full max-w-lg text-center md:text-left">
            <h2 className="display-heading text-white text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.9] mb-8 tracking-widest" style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.1)' }}>
               FRICTIONLESS.<br/>
               PREMIUM.<br/>
              <span className="text-[#A033FF]" style={{ textShadow: '4px 4px 0 #000' }}>POST-PURCHASE DASHBOARD.</span>
            </h2>
            <p className="text-black font-black text-xl mb-12 bg-[#EFC5FF] inline-block px-8 py-3 border-[6px] border-black shadow-[8px_8px_0_#000] rotate-[2deg]">
              BUILT FOR SPEED. ZERO AI GARBAGE.
            </p>
            <div className="flex justify-center md:justify-start">
               {inView && <DashboardPreview />}
            </div>
          </div>

          {/* ── RIGHT: Pricing card ── */}
          <div className="w-full max-w-[420px] flex flex-col z-20 mt-10 md:mt-0">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, type: 'spring' }}
               className="bg-white border-[6px] border-black text-center px-8 py-12 shadow-[20px_20px_0_#000] relative rounded-[2rem]"
            >
              {/* Badge */}
              <div className="absolute -top-6 -right-6 bg-[#A033FF] border-4 border-black text-white font-black px-8 py-3 rotate-[6deg] shadow-[6px_6px_0_#000] text-xl tracking-widest">
                MOST POPULAR
              </div>

              {/* Heading */}
              <p className="font-black text-3xl text-black tracking-widest uppercase mb-1">
                BREVLO PREMIUM.
              </p>
              <p className="font-bold text-lg text-[#666] tracking-widest uppercase mb-8">
                ONE FLAT FEE.
              </p>

              {/* Price */}
              <div className="mb-10 block">
                <span className="font-display text-[7rem] font-black leading-none tracking-tighter text-black" style={{ textShadow: '6px 6px 0 #EFC5FF' }}>
                  $20
                </span>
                <span className="block font-black text-xl tracking-widest text-[#A033FF] uppercase mt-4">
                  / PER THUMBNAIL
                </span>
              </div>

              {/* CTA */}
              <a href="/order" className="block outline-none group">
                <button className="bg-white border-[6px] border-black w-full py-5 text-2xl font-black text-black shadow-[8px_8px_0_#000] group-hover:bg-[#A033FF] group-hover:text-white group-hover:translate-y-2 group-hover:shadow-none active:translate-y-4 transition-all duration-200 uppercase tracking-widest">
                  GET STARTED NOW
                </button>
              </a>
            </motion.div>

            {/* Trust items */}
            <div className="mt-12 flex flex-col gap-5">
              {TRUST.map((item, i) => (
                <motion.div 
                   key={i} 
                   initial={{ opacity: 0, x: 20 }}
                   animate={inView ? { opacity: 1, x: 0 } : {}}
                   transition={{ delay: 0.4 + (i * 0.1) }}
                   className={`flex items-center gap-5 ${item.bg} border-[5px] border-black ${item.shadow} px-6 py-4 rounded-xl relative hover:translate-x-2 transition-transform cursor-default`}
                >
                  <div className={`text-4xl font-black text-black`}>
                    {item.icon}
                  </div>
                  <span className={`${item.text} font-black tracking-widest text-lg uppercase`}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
