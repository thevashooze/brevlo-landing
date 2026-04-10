'use client'

import { motion } from 'framer-motion'

/* Floating abstract shapes to replace old clutter */
const FLOATING_SHAPES = [
  { type: 'cross', color: '#EFC5FF', top: '15%', left: '10%', size: 40, delay: 0 },
  { type: 'circle', color: '#A033FF', top: '30%', right: '15%', size: 60, delay: 1 },
  { type: 'square', color: '#22c55e', top: '65%', left: '15%', size: 45, delay: 0.5 },
  { type: 'cross', color: '#ef4444', top: '75%', right: '10%', size: 30, delay: 1.5 },
]

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-start pt-20 pb-16 overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden sm:block">
        {FLOATING_SHAPES.map((shape, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: shape.type === 'square' ? [0, 90, 180] : [0, 0, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: shape.delay,
              ease: 'easeInOut'
            }}
            className="absolute"
            style={{
              top: shape.top,
              left: shape.left,
              right: shape.right,
            }}
          >
            {shape.type === 'circle' && (
              <div style={{ width: shape.size, height: shape.size, borderRadius: '50%', border: '6px solid black', backgroundColor: shape.color, boxShadow: '4px 4px 0 #000' }} />
            )}
            {shape.type === 'square' && (
              <div style={{ width: shape.size, height: shape.size, border: '6px solid black', backgroundColor: shape.color, boxShadow: '4px 4px 0 #000' }} />
            )}
            {shape.type === 'cross' && (
              <div className="relative" style={{ width: shape.size, height: shape.size }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '12px', marginTop: '-6px', backgroundColor: shape.color, border: '3px solid black' }}></div>
                <div style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '12px', marginLeft: '-6px', backgroundColor: shape.color, border: '3px solid black' }}></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 px-4">
      
        {/* ── Process arrows ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 mb-8 z-10 flex-wrap justify-center">
          {['DESIGN AUDIT', 'TARGETING', 'EXECUTION'].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <span className="nb-pill text-black">{step}</span>
              {i < 2 && <span className="text-black font-black text-xl">→</span>}
            </div>
          ))}
        </motion.div>

        {/* ── Main display headline ── */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative z-10 text-center mb-10 px-4 w-full">
          <h1 className="display-heading text-[clamp(4.5rem,10vw,8.5rem)] text-white max-w-[1200px] mx-auto hero-text-shadow leading-[0.85]">
            Brevlo,<br />Beyond<br />Visuals.
          </h1>
        </motion.div>

        {/* ── CTA button ── */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: 'spring', delay: 0.32 }} className="relative z-10 flex flex-col items-center mt-4">
          <a href="/order">
            <button className="nb-btn hover-purple transition-all duration-300 px-8 py-5 text-[clamp(16px,2vw,22px)] font-black uppercase">
              RECLAIM YOUR AUDIENCE. GET STARTED NOW.
            </button>
          </a>
          
          {/* Animated Down Arrow */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-12 opacity-80 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth'})}
          >
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
             </svg>
          </motion.div>
        </motion.div>
        
      </div>

      <style jsx>{`
        .hero-text-shadow {
          text-shadow: 6px 6px 0 #000, 10px 10px 0 rgba(0,0,0,0.15) !important;
          -webkit-text-stroke: 4px #000;
        }
        /* Override hover states for the hero button specifically */
        .hover-purple:hover {
          background-color: #A033FF !important;
          color: white !important;
          border-color: black !important;
        }
      `}</style>
    </section>
  )
}
