'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FACTS = [
  { val: '2023',       label: 'Founded',    sub: "Built from a creator's frustration" },
  { val: '500+',       label: 'Thumbnails', sub: 'Delivered. On time. Every time.'    },
  { val: '< 24 hrs',   label: 'Turnaround', sub: 'Fastest in the game'               },
  { val: '100% Human', label: 'No AI',      sub: 'Real designers. Real psychology.'  },
]

export default function AboutUs() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section">
      <div className="container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-rocket text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
            WHO WE <span style={{ color: '#FFE600' }}>ARE.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            A studio built by creators, for creators
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl border-4 border-black overflow-hidden shadow-[20px_20px_0_#FFE600]"
          style={{ background: '#0A0A0A' }}
        >
          <div className="flex flex-col lg:flex-row">

            {/* Left — copy */}
            <div
              className="flex-1 p-10 flex flex-col justify-center gap-6"
              style={{ borderBottom: '4px solid rgba(255,255,255,0.08)' }}
            >
              <span className="label-tag self-start">India's #1 Thumbnail Studio</span>

              <p className="text-white font-black text-2xl sm:text-3xl uppercase leading-tight tracking-wide">
                We don't do average.<br />
                <span style={{ color: '#FFE600' }}>We do click-worthy.</span>
              </p>

              <p className="text-white/50 font-bold text-base leading-relaxed">
                Brevlo is a premium YouTube thumbnail design studio. We work with creators across every niche — gaming, finance, history, vlogs — turning raw ideas into scroll-stopping visuals that get clicked.
              </p>

              <p className="text-white/30 font-bold text-sm leading-relaxed">
                No AI slop. No templates. Every thumbnail is hand-crafted by a real designer who understands YouTube psychology, color theory, and what makes someone stop mid-scroll.
              </p>

              <a href="/order" className="self-start">
                <button className="nb-btn-yellow px-8 py-3 text-sm tracking-widest">
                  GET STARTED →
                </button>
              </a>
            </div>

            {/* Right — facts */}
            <div className="flex-1 p-10 flex flex-col justify-center gap-4 lg:border-l-4 border-white/10">
              {FACTS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-5 px-5 py-4 border-2 border-white/10"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="w-1 self-stretch flex-shrink-0" style={{ background: '#FFE600' }} />
                  <div>
                    <p className="font-rocket text-[#FFE600] text-2xl leading-none mb-1">{item.val}</p>
                    <p className="text-white font-black text-xs uppercase tracking-widest">{item.label}</p>
                    <p className="text-white/30 font-bold text-xs mt-0.5">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
