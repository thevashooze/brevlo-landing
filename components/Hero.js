'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
}

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 65%)',
            opacity: 0.07,
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            opacity: 0.04,
            filter: 'blur(60px)',
          }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center relative z-10"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium tracking-[0.2em] uppercase"
          style={{
            borderColor: 'rgba(168,85,247,0.25)',
            color: '#c084fc',
            background: 'rgba(168,85,247,0.06)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          YouTube Thumbnail Agency
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-bold tracking-tight leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(4rem, 10vw, 7.5rem)' }}
        >
          <span className="text-white block">Beyond</span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #c084fc 0%, #ec4899 55%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Visuals.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg font-light tracking-[0.15em] text-gray-500 uppercase mb-12 max-w-sm"
        >
          We engineer the psychology of the click.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => scrollTo('contact')}
            className="px-8 py-3.5 text-sm font-semibold tracking-wide rounded-full text-white transition-all duration-200 hover:scale-[1.03] hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 0 40px rgba(168,85,247,0.22), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            Start Your Project →
          </button>
          <button
            onClick={() => scrollTo('portfolio')}
            className="px-8 py-3.5 text-sm font-semibold tracking-wide rounded-full text-gray-400 border transition-all duration-200 hover:text-white hover:border-purple-500/40 active:scale-[0.98]"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            View Our Work
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase text-gray-600">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent"
        />
      </motion.div>
    </section>
  )
}
