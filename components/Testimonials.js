'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const REVIEWS = [
  {
    quote: "Went from 2.1% to 7.4% CTR after my first Brevlo thumbnail. I was skeptical about $20 but honestly it's made me hundreds in extra revenue.",
    name: 'Alex R.',
    handle: '@FinanceWithAlex',
    subs: '280K subs',
    accent: '#FFE600',
    accentText: '#0A0A0A',
    shadow: '#FFE600',
  },
  {
    quote: "Same-day delivery is insane. Used to wait 5 days for freelancers and the quality was trash. Brevlo just gets it — fast and actually good.",
    name: 'Marcus T.',
    handle: '@MarcusTech',
    subs: '150K subs',
    accent: '#A033FF',
    accentText: '#fff',
    shadow: '#A033FF',
  },
  {
    quote: "I run 3 channels. Brevlo handles all my thumbnails now. The consistency across niches is what impressed me most.",
    name: 'Priya M.',
    handle: '@PriyaCreates',
    subs: '520K subs',
    accent: '#D4AAFF',
    accentText: '#0A0A0A',
    shadow: '#0A0A0A',
  },
]

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE600" stroke="#0A0A0A" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Card({ r, i, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.1, type: 'spring', stiffness: 90 }}
      className="flex flex-col gap-5 border-4 border-black bg-white p-7"
      style={{ boxShadow: `6px 6px 0 ${r.shadow}` }}
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
      </div>

      <p className="text-black/80 text-[15px] leading-relaxed font-medium flex-1">
        "{r.quote}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t-4 border-black">
        <div
          className="w-10 h-10 flex items-center justify-center font-black text-base flex-shrink-0 border-4 border-black"
          style={{ background: r.accent, color: r.accentText, boxShadow: '2px 2px 0 #0A0A0A' }}
        >
          {r.name[0]}
        </div>
        <div>
          <p className="text-black font-black text-sm leading-tight">{r.name}</p>
          <p className="text-black/40 text-xs mt-0.5 font-semibold">{r.handle} · {r.subs}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="font-black text-white text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase tracking-tight leading-[0.95] mb-3">
            THEY USED TO <span style={{ color: '#FFE600' }}>LOSE CLICKS</span> TOO.
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Real results. Real creators.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => <Card key={i} r={r} i={i} inView={inView} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {['500+ thumbnails delivered', '4.9★ average rating', '0% AI — 100% human'].map((t, i) => (
            <span key={i} className="nb-pill-yellow">{t}</span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
