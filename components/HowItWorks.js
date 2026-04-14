'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'Submit Your Brief',
    desc: 'Share your video title, niche, and any references. Two minutes. Done.',
    bg: '#FFE600',
    textColor: '#0A0A0A',
    shadow: '#0A0A0A',
  },
  {
    n: '02',
    title: 'We Design It',
    desc: 'A real human designer — not AI — crafts your thumbnail in 8–12 hours.',
    bg: '#A033FF',
    textColor: '#fff',
    shadow: '#0A0A0A',
  },
  {
    n: '03',
    title: 'Publish & Win',
    desc: 'Download, upload, done. Not happy? 2 free revisions included. No drama.',
    bg: '#0A0A0A',
    textColor: '#FFE600',
    shadow: '#FFE600',
  },
]

export default function HowItWorks() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" ref={ref} className="section">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="font-black text-white text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase tracking-tight leading-[0.95] mb-3">
            HOW IT <span style={{ color: '#FFE600' }}>WORKS</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            3 steps. That's it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12, type: 'spring', stiffness: 100 }}
              className="border-4 border-black p-8 relative"
              style={{ background: s.bg, boxShadow: `8px 8px 0 ${s.shadow}` }}
            >
              <div
                className="font-black text-[5rem] leading-none mb-4 opacity-20 select-none"
                style={{ color: s.textColor }}
              >
                {s.n}
              </div>
              <h3
                className="font-black text-xl mb-3 uppercase tracking-wide leading-tight"
                style={{ color: s.textColor }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed font-medium"
                style={{ color: s.textColor, opacity: 0.7 }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a href="/order">
            <button className="nb-btn-yellow px-10 py-4 text-base">
              START MY ORDER →
            </button>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
