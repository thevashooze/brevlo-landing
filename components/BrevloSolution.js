'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BEFORE = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/living%20in%20poorest%20city%20no%20text.jpg'
const AFTER  = 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/robert%20openhiemer.jpg'

export default function BrevloSolution() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative w-full py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1200px] mx-auto">

        {/* ── Section title ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="display-heading text-white text-[clamp(2rem,6vw,4.5rem)] tracking-widest uppercase mb-2" style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.1)' }}>
            BREVLO SOLUTION & VISUAL PROOF
          </h2>
        </motion.div>

        {/* ── Main Comparison Card Wrapper ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="w-full"
        >
          {/* Top block (Thumbnails) */}
          <div className="flex flex-col xl:flex-row items-center justify-between nb-card bg-[#2A0845] p-4 shadow-[16px_16px_0_#000] rounded-[2rem] relative w-full">
             
             {/* Left - Before */}
             <div className="flex-1 w-full relative">
               <div className="absolute top-6 left-6 z-10 bg-black text-white font-black px-4 py-2 rounded-xl border-4 border-white text-base uppercase shadow-[4px_4px_0_#A033FF]">Before</div>
               
               <div className="w-full aspect-[16/10] relative mb-4">
                 {/* Image Container */}
                 <div className="absolute inset-0 rounded-2xl border-4 border-black overflow-hidden bg-black">
                   <img src={BEFORE} alt="Before" className="w-full h-full object-cover opacity-80" />
                 </div>
                 
                 {/* Floating Badge explicitly popping out */}
                 <div className="absolute -bottom-4 right-4 bg-white border-4 border-black px-6 py-3 rounded-xl shadow-[6px_6px_0_#000] rotate-2 z-20 max-w-[90%]">
                   <p className="text-red-600 font-black text-sm sm:text-lg leading-none tracking-widest uppercase mb-1">Cheap Freelancer</p>
                   <p className="text-black font-black text-xs sm:text-sm leading-tight tracking-wide uppercase">(Missing Deadlines & Context)</p>
                 </div>
               </div>
             </div>

             {/* Arrow Center */}
             <div className="bg-[#EFC5FF] border-y-4 xl:border-y-0 xl:border-x-4 border-black flex items-center justify-center py-6 px-8 xl:py-16 xl:px-8 relative z-20 mx-[-4px] xl:my-[-4px]">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
             </div>

             {/* Right - After */}
             <div className="flex-1 w-full relative h-[100%]">
               <div className="absolute top-6 right-6 z-10 bg-[#EFC5FF] text-black font-black px-4 py-2 rounded-xl border-4 border-black text-base uppercase shadow-[4px_4px_0_#000]">After</div>
               
               <div className="w-full aspect-[16/10] relative mb-4">
                 {/* Image Container */}
                 <div className="absolute inset-0 rounded-2xl border-4 border-black overflow-hidden bg-white">
                   <img src={AFTER} alt="After" className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Floating Badge */}
                 <div className="absolute -bottom-4 left-4 bg-black border-4 border-white px-6 py-3 rounded-xl shadow-[6px_6px_0_#A033FF] -rotate-2 z-20 max-w-[90%]">
                   <p className="text-[#EFC5FF] font-black text-xs sm:text-sm leading-none tracking-widest uppercase mb-2">BREVLO PREMIUM</p>
                   <p className="text-white font-black text-lg sm:text-xl leading-none tracking-widest uppercase">Flawless Execution</p>
                 </div>
               </div>
             </div>
          </div>

          {/* ── Bottom block (Stats) ── */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full mt-10 gap-6 px-4 md:px-12">
             {/* Left pill */}
             <div className="bg-black border-4 border-black text-white px-6 py-4 rounded-2xl shadow-[6px_6px_0_#000] font-black text-xl lg:text-2xl w-full md:w-auto text-center">
               <span className="opacity-70 font-normal">SPEED:</span> SLOW & UNRELIABLE
             </div>

             {/* Dotted line arrow */}
             <div className="flex-1 flex items-center gap-4 px-4 opacity-50 hidden md:flex">
               <div className="h-1.5 bg-black w-full" style={{ backgroundImage: 'linear-gradient(to right, #000 50%, transparent 50%)', backgroundSize: '24px 4px', backgroundRepeat: 'repeat-x' }}></div>
               <div className="text-black font-black text-2xl">▶</div>
             </div>

             {/* Right pill */}
             <div className="bg-black border-4 border-[#A033FF] text-[#EFC5FF] px-6 py-4 rounded-2xl shadow-[6px_6px_0_#000] font-black text-xl lg:text-2xl w-full md:w-auto text-center">
               <span className="opacity-70 font-normal">SPEED:</span> SAME-DAY TURNAROUND
             </div>
          </div>

          {/* Investment tagline */}
          <div className="text-center mt-10 mb-8">
            <p className="text-black font-black tracking-wide text-xl bg-white/70 border-4 border-black inline-block px-6 py-3 shadow-[4px_4px_0_#000]">
              Investment: <span className="font-black text-[#A033FF]">$20.</span> Returns: <span className="font-black text-green-600">Priceless.</span>
            </p>
          </div>
          
        </motion.div>
      </div>
    </section>
  )
}
