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
          className="mb-16"
        >
          <span className="label-tag mb-5 inline-block">Introduction</span>
          <h2
            className="font-rocket text-white leading-none mb-4"
            style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}
          >
            WHO WE <span style={{ color: '#FFE600' }}>ARE.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            A studio built by creators, for creators.
          </p>
        </motion.div>

        {/* Two-column open layout — no dark card wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left — copy on page bg */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-white font-black text-2xl sm:text-3xl uppercase leading-tight tracking-wide">
              We don't do average.<br />
              <span style={{ color: '#FFE600' }}>We do click-worthy.</span>
            </p>

            <p className="text-white/55 font-bold text-base leading-relaxed">
              Brevlo is a premium YouTube thumbnail design studio. We work with creators across every niche: gaming, finance, history, vlogs, turning raw ideas into scroll-stopping visuals that get clicked.
            </p>

            <p className="text-white/30 font-bold text-sm leading-relaxed">
              No AI slop. No templates. Every thumbnail is hand-crafted by a real designer who understands YouTube psychology, color theory, and what makes someone stop mid-scroll.
            </p>

            <a href="/order" className="self-start mt-2">
              <button className="nb-btn-yellow px-8 py-3 text-sm tracking-widest">
                GET STARTED →
              </button>
            </a>
          </motion.div>

          {/* Right — white nb-cards with press animation */}
          <div className="flex flex-col gap-4">
            {FACTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.15 + i * 0.09, ease: [0.23, 1, 0.32, 1] } } : {}}
              >
                <div className="nb-card-hover flex items-center gap-5 px-6 py-5 cursor-default">
                  <p
                    className="font-rocket leading-none flex-shrink-0"
                    style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#A033FF' }}
                  >
                    {item.val}
                  </p>
                  <div className="border-l-2 border-black/10 pl-5">
                    <p className="text-black font-black text-sm uppercase tracking-widest">{item.label}</p>
                    <p className="text-black/45 font-bold text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
