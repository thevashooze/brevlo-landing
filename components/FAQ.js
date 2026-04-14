'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const FAQS = [
  { q: 'How fast will I get my thumbnail?', a: 'Most orders complete in 8–12 hours. We guarantee delivery within 24 hours — or your money back, no questions.' },
  { q: 'Do you use AI to generate thumbnails?', a: 'Never. Every thumbnail is designed by a real human. AI generates generic visuals — we engineer psychological triggers specific to your niche and audience.' },
  { q: "What if I don't like the result?", a: "2 free revisions are included with every order. Tell us what to change and we'll fix it fast. We don't stop until you're happy." },
  { q: 'What format do you deliver?', a: 'You get a 1280×720 PNG, fully YouTube-ready. PSD source files available on request.' },
  { q: 'Is $20 really the final price?', a: 'Yes. $20 flat per thumbnail. No setup fees. No revision fees. No surprises. What you see is what you pay.' },
  { q: 'Can I order in bulk?', a: 'Absolutely. Many of our clients order batches for upcoming content. Message us for bulk rates.' },
]

function Item({ item, i, inView }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: i * 0.07 }}
      className="border-b-4 border-white/10 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-black text-white text-base uppercase tracking-wide">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.18 }}
          className="flex-shrink-0 w-8 h-8 border-4 flex items-center justify-center font-black text-xl leading-none"
          style={{
            background: open ? '#FFE600' : 'transparent',
            borderColor: open ? '#0A0A0A' : 'rgba(255,255,255,0.3)',
            color: open ? '#0A0A0A' : '#fff',
            boxShadow: open ? '3px 3px 0 #0A0A0A' : 'none',
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-white/50 text-sm leading-relaxed font-medium pb-5 pr-8">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="faq" ref={ref} className="section">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div className="lg:w-[360px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-black text-white text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase tracking-tight leading-[0.95] mb-4">
                GOT <span style={{ color: '#FFE600' }}>QUESTIONS?</span>
              </h2>
              <p className="text-white/40 font-medium text-sm leading-relaxed mb-8 uppercase tracking-wide">
                Everything you need to know before placing your first order.
              </p>
              <a href="/order">
                <button className="nb-btn-yellow px-7 py-3.5 text-sm">
                  JUST ORDER & SEE →
                </button>
              </a>
            </motion.div>
          </div>

          {/* Right — accordion */}
          <div className="flex-1 w-full">
            {FAQS.map((item, i) => (
              <Item key={i} item={item} i={i} inView={inView} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
