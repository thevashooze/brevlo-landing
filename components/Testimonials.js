'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const REVIEWS = [
  {
    stars: 5,
    quote: "Went from 2.3% to 8.1% CTR in three weeks. At $20 a thumbnail that's the best ROI I've ever seen. My analytics dashboard doesn't lie.",
    name: 'Tyler B.',
    handle: '@TylerBuilds',
    subs: '82K subs',
    accent: '#FFE600',
    accentText: '#0A0A0A',
    shadow: '#FFE600',
  },
  {
    stars: 5,
    quote: "Same-day turnaround and the quality is insane. Used to wait 5 days for freelancers and they delivered garbage. Brevlo just gets it.",
    name: 'Marcus T.',
    handle: '@MarcusTech',
    subs: '67K subs',
    accent: '#A033FF',
    accentText: '#fff',
    shadow: '#A033FF',
  },
  {
    stars: 4,
    quote: "CTR went from 3.4% to 6.2% across my last 8 videos. Consistent, reliable, and $20 is basically nothing for the lift you get.",
    name: 'Emma W.',
    handle: '@EmmaTalksFinance',
    subs: '45K subs',
    accent: '#D4AAFF',
    accentText: '#0A0A0A',
    shadow: '#0A0A0A',
  },
  {
    stars: 5,
    quote: "I run 3 channels across gaming, tech, and finance. Brevlo handles all of them. The niche-specific thinking they put into each thumbnail is what sets them apart.",
    name: 'Jake O.',
    handle: '@JakeOnline',
    subs: '91K subs',
    accent: '#FFE600',
    accentText: '#0A0A0A',
    shadow: '#FFE600',
  },
  {
    stars: 5,
    quote: "My editor recommended Brevlo and I was skeptical. First thumbnail hit 9.3% CTR. Been a customer 4 months straight. Not switching.",
    name: 'Chris V.',
    handle: '@ChrisVlogs',
    subs: '78K subs',
    accent: '#A033FF',
    accentText: '#fff',
    shadow: '#A033FF',
  },
  {
    stars: 4,
    quote: "Good thumbnails, genuinely fast. Revision process was smooth — they actually listened. Would be 5 stars if the ordering dashboard had more options.",
    name: 'Mia F.',
    handle: '@MiaFitness',
    subs: '53K subs',
    accent: '#00CC6A',
    accentText: '#0A0A0A',
    shadow: '#0A0A0A',
  },
  {
    stars: 5,
    quote: "Gaming channel went from 2.8% to 7.1% CTR. Thousands of extra clicks per video just from the thumbnail. The $20 pays for itself in the first 200 views.",
    name: 'Zach K.',
    handle: '@ZachKGaming',
    subs: '88K subs',
    accent: '#FFE600',
    accentText: '#0A0A0A',
    shadow: '#FFE600',
  },
  {
    stars: 5,
    quote: "My audience now comments on how good my thumbnails look. That never happened before Brevlo. When viewers notice the thumbnail, you know it's working.",
    name: 'Sofia R.',
    handle: '@SofiaReacts',
    subs: '62K subs',
    accent: '#A033FF',
    accentText: '#fff',
    shadow: '#A033FF',
  },
  {
    stars: 4,
    quote: "30-day test on my tech channel. Average CTR went from 3.1% to 5.8%. Consistent across every upload. At $20 the math just works.",
    name: 'Aiden L.',
    handle: '@AidenTechReviews',
    subs: '95K subs',
    accent: '#D4AAFF',
    accentText: '#0A0A0A',
    shadow: '#0A0A0A',
  },
  {
    stars: 5,
    quote: "Ordered 12 thumbnails for a series upload. Every single one on time, all hitting above 6% CTR. That consistency is what I pay for.",
    name: 'Lucas D.',
    handle: '@LucasDaily',
    subs: '74K subs',
    accent: '#FFE600',
    accentText: '#0A0A0A',
    shadow: '#FFE600',
  },
]

const N = REVIEWS.length

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? '#FFE600' : 'none'}
      stroke={filled ? '#0A0A0A' : 'rgba(255,255,255,0.25)'}
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function NavBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex-shrink-0 w-11 h-11 flex items-center justify-center border-4 border-black bg-white text-black cursor-pointer select-none"
      style={{ boxShadow: '6px 6px 0 #0A0A0A', transition: 'transform 0.1s, box-shadow 0.1s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(6px,6px)'; e.currentTarget.style.boxShadow = '0 0 0 #0A0A0A' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A' }}
    >
      {children}
    </button>
  )
}

/* Container: instant exit, staggered enter */
const groupVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.02 },
  },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
}

/* Individual card: slide up + fade in, slide up + fade out */
const cardVariants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } },
  exit:   { opacity: 0, y: -10, transition: { duration: 0.15 } },
}

export default function Testimonials() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [page, setPage] = useState(0)

  const next = () => setPage(p => (p + 1) % N)
  const prev = () => setPage(p => (p - 1 + N) % N)

  const visible = [
    REVIEWS[page % N],
    REVIEWS[(page + 1) % N],
    REVIEWS[(page + 2) % N],
  ]

  return (
    <section ref={ref} className="section">
      <div className="container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2
            className="font-black text-white uppercase leading-[0.95] mb-3 whitespace-nowrap"
            style={{ fontSize: 'clamp(1.2rem,3.8vw,4rem)' }}
          >
            REAL CREATORS. <span style={{ color: '#FFE600' }}>REAL RESULTS.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Numbers don't lie. Neither do our clients.
          </p>
        </motion.div>

        {/* Carousel row */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {/* Left arrow */}
          <div className="flex-shrink-0 w-11">
            {page !== 0 && (
              <NavBtn onClick={prev} label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </NavBtn>
            )}
          </div>

          {/* Slide container */}
          <div className="flex-1" style={{ paddingRight: '8px', paddingBottom: '10px' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                variants={groupVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {visible.map((r, i) => (
                    <motion.div
                      key={i}
                      variants={cardVariants}
                      className="testimonial-card flex flex-col gap-5 border-4 border-black bg-white p-7 cursor-default"
                      style={{
                        boxShadow: `6px 6px 0 ${r.shadow}`,
                        '--card-shadow': r.shadow,
                        minHeight: '300px',
                      }}
                    >
                      {/* Stars */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <StarIcon key={j} filled={j < r.stars} />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-black/80 text-[15px] leading-relaxed font-medium flex-1">
                        "{r.quote}"
                      </p>

                      {/* Author */}
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
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <div className="flex-shrink-0 w-11">
            <NavBtn onClick={next} label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </NavBtn>
          </div>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: i === page ? '24px' : '8px',
                height: '8px',
                background: i === page ? '#FFE600' : 'rgba(255,255,255,0.3)',
                border: '2px solid #0A0A0A',
                boxShadow: i === page ? '2px 2px 0 #0A0A0A' : 'none',
                transition: 'all 0.18s ease',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {['500+ thumbnails delivered', '4.9★ average rating', '0% AI, 100% human'].map((t, i) => (
            <span key={i} className="nb-pill-yellow">{t}</span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
