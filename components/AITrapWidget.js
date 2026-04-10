'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BEFORE_IMG = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/detective%20(3).jpg'
const AFTER_IMG  = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/he%20is%20back%20travis%201.jpg'

export default function AITrapWidget() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative w-full py-16 px-4 flex flex-col items-center">
      
      {/* ── Section title ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="display-heading text-white text-[clamp(2rem,6vw,4.5rem)] tracking-widest uppercase mb-2" style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.1)' }}>
          AI TRAP WIDGET
        </h2>
      </motion.div>

      {/* ── Main widget container ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="w-full max-w-[1200px] mx-auto flex flex-col items-center"
      >
        {/* Tab & Input Field UI */}
        <div className="w-full relative mb-16 flex flex-col items-center max-w-5xl px-4">
           {/* Tab on top */}
           <div className="bg-white border-4 border-black rounded-t-xl px-6 py-2 border-b-0 w-[240px] sm:w-[280px] text-center self-start sm:ml-12 -mb-1 relative z-10">
             <span className="text-black font-black text-xs sm:text-sm tracking-widest">YOUR VIDEO TITLE</span>
           </div>
           {/* Main Input Field */}
           <div className="bg-white border-4 border-black rounded-xl p-4 sm:p-6 w-full shadow-[8px_8px_0_#000] relative z-20">
             <div className="text-black font-black text-2xl sm:text-4xl lg:text-5xl tracking-wide truncate">
               THE UNTOLD STORY OF CRYPTO
             </div>
           </div>
        </div>

        {/* Before / After Blocks */}
        <div className="flex flex-col xl:flex-row items-center xl:items-stretch gap-16 xl:gap-16 w-full justify-center">
          
          {/* ── BEFORE COL ── */}
          <div className="flex-1 w-full max-w-2xl flex flex-col">
             <div className="nb-card-dark bg-[#111] border-4 border-black flex flex-col p-6 shadow-[16px_16px_0_#000] rounded-3xl w-full flex-1">
               <div className="w-full aspect-[16/10] relative mb-12">
                 
                 {/* Image Container */}
                 <div className="absolute inset-0 rounded-2xl border-4 border-black overflow-hidden bg-black">
                   <img src={BEFORE_IMG} className="w-full h-full object-cover opacity-60" />
                 </div>
                 
                 {/* Red X */}
                 <div className="absolute top-4 left-4 bg-black border-4 border-black rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-[4px_4px_0_#ef4444] z-10">
                   <span className="text-red-500 font-black text-3xl sm:text-4xl leading-none">✗</span>
                 </div>
                 
                 {/* Floating Badge - explicitly positioned to pop out */}
                 <div className="absolute -bottom-6 right-2 sm:right-6 bg-white border-4 border-black px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-[6px_6px_0_#000] rotate-2 z-20 max-w-[90%]">
                   <p className="text-red-600 font-black text-sm sm:text-lg leading-none tracking-widest uppercase mb-1">Confusing</p>
                   <p className="text-black font-black text-xs sm:text-base leading-none tracking-widest uppercase">Psychology</p>
                 </div>
               </div>
               
               <div className="text-center mt-auto pb-2 flex justify-center">
                 <p className="text-white font-black text-lg sm:text-xl tracking-widest uppercase bg-[#222] border-4 border-[#444] px-4 py-3 sm:px-8 sm:py-4 rounded-xl w-full max-w-sm">
                   AI-GENERATED SLOP
                 </p>
               </div>
             </div>
          </div>

          {/* ── ARROW COL ── */}
          <div className="flex flex-col items-center justify-center pt-4 xl:pt-0">
             <div className="bg-[#EFC5FF] border-4 border-black py-4 px-8 shadow-[8px_8px_0_#000] flex items-center justify-center font-black text-black whitespace-nowrap text-2xl rounded-2xl rotate-[-2deg]">
                RESULT <span className="text-4xl leading-none ml-4">→</span>
             </div>
          </div>

          {/* ── AFTER COL ── */}
          <div className="flex-1 w-full max-w-2xl flex flex-col">
            <div className="bg-[#EFC5FF] border-4 border-black flex flex-col p-6 shadow-[16px_16px_0_#000] rounded-3xl w-full flex-1">
               <div className="w-full aspect-[16/10] relative mb-12">
                 
                 {/* Image Container */}
                 <div className="absolute inset-0 rounded-2xl border-4 border-black overflow-hidden bg-white">
                   <img src={AFTER_IMG} className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Green Check */}
                 <div className="absolute top-4 left-4 bg-white border-4 border-black rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-[4px_4px_0_#22c55e] z-10">
                   <span className="text-green-500 font-black text-3xl sm:text-4xl leading-none">✓</span>
                 </div>
                 
                 {/* Floating Badge - escaping container */}
                 <div className="absolute -bottom-6 right-2 sm:right-6 bg-black border-4 border-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-[6px_6px_0_#A033FF] -rotate-2 z-20 max-w-[90%]">
                   <p className="text-[#EFC5FF] font-black text-xs sm:text-xs leading-none tracking-widest uppercase mb-2">HUMAN-CRAFTED</p>
                   <p className="text-white font-black text-sm sm:text-xl leading-none tracking-widest uppercase">Strategic Triumph</p>
                 </div>
               </div>
               
               <div className="text-center mt-auto pb-2 flex justify-center">
                 <p className="text-black font-black text-lg sm:text-xl tracking-widest uppercase bg-white border-4 border-black px-4 py-3 sm:px-8 sm:py-4 rounded-xl shadow-[4px_4px_0_#000] w-full max-w-sm">
                   BREVLO QUALITY
                 </p>
               </div>
             </div>
          </div>

        </div>
      </motion.div>
    </section>
  )
}
