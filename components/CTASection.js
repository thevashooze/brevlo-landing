'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTASection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative w-full border-y-[6px] border-black overflow-hidden" style={{ background: '#FFE600' }}>
      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none grid-live" />

      <div className="relative container py-24 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-rocket text-[clamp(3rem,9vw,7rem)] text-black leading-[0.9] tracking-wide"
          >
            READY TO STOP<br />LOSING CLICKS?
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-black/70 font-black text-sm uppercase tracking-[0.2em]"
        >
          $20 flat · Same day · Human designed · 2 free revisions
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <a href="/order">
            <button className="nb-btn px-14 py-5 text-xl">
              ORDER NOW →
            </button>
          </a>
          <a href="#faq">
            <button className="border-4 border-black px-10 py-5 text-sm font-black uppercase tracking-wide text-black hover:bg-black hover:text-[#FFE600] transition-colors duration-100">
              SEE FAQ
            </button>
          </a>
        </motion.div>

        {/* Micro stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 text-black/50 font-black text-xs uppercase tracking-widest mt-2"
        >
          <span>500+ delivered</span>
          <span>·</span>
          <span>4.9★ rating</span>
          <span>·</span>
          <span>24h guarantee</span>
        </motion.div>
      </div>
    </section>
  )
}
