'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 500, suffix: '+', label: 'Thumbnails Delivered' },
  { value: 98,  suffix: '%', label: 'Client Retention' },
  { value: 2.4, suffix: '×', label: 'Avg CTR Increase', decimal: true },
  { value: 48,  suffix: 'h', label: 'Turnaround Time' },
]

const ease = [0.25, 0.1, 0.25, 1]

function CountUp({ value, suffix, decimal }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    let startTime = null
    const duration = 1800
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * value
      setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, value, decimal])

  return (
    <span ref={ref}>
      {decimal ? count.toFixed(1) : count}{suffix}
    </span>
  )
}

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-xs font-medium tracking-[0.25em] uppercase mb-5"
          style={{ color: '#a855f7' }}
        >
          Who We Are
        </motion.p>

        <div className="grid md:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white">
              We don't just design.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                We engineer clicks.
              </span>
            </h2>
            <div className="mt-8 w-10 h-0.5 rounded-full" style={{ background: '#a855f7' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="flex flex-col gap-5 pt-2"
          >
            <p className="text-gray-400 text-base font-light leading-relaxed">
              Brevlo is a data-driven thumbnail agency built for creators who take growth seriously.
              We study what makes viewers click — psychology, color theory, composition — and turn
              that into visuals that perform.
            </p>
            <p className="text-gray-400 text-base font-light leading-relaxed">
              Every thumbnail we create is backed by research, not guesswork. From facecam shots to
              cinematic concepts, we build visuals that compete at the highest level on YouTube.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.08 }}
              className="p-7 rounded-2xl border text-center"
              style={{
                borderColor: 'rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <p className="text-4xl font-bold mb-2" style={{ color: '#c084fc' }}>
                <CountUp value={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
              </p>
              <p className="text-xs font-medium tracking-[0.18em] uppercase text-gray-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
