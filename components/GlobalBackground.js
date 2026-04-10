'use client'

import { motion } from 'framer-motion'
import GlitchDots from './GlitchDots'

/* Fun background doodles that drift across the entire page */
const DOODLES = [
  { type: 'star', color: '#FFF', top: '15%', left: '5%', size: 24, delay: 0 },
  { type: 'zig', color: '#A033FF', top: '40%', right: '8%', size: 40, delay: 2 },
  { type: 'dot', color: '#22c55e', top: '65%', left: '12%', size: 16, delay: 1 },
  { type: 'star', color: '#ef4444', top: '85%', right: '10%', size: 30, delay: 3 },
  { type: 'zig', color: '#FFF', top: '25%', left: '80%', size: 50, delay: 1.5 },
  { type: 'dot', color: '#A033FF', top: '90%', left: '50%', size: 20, delay: 0.5 },
]

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-5]">
      
      {/* ── Core Texture ── */}
      <div className="bg-texture-grid"></div>
      
      {/* ── Random Noise Dots ── */}
      <GlitchDots />

      {/* ── Floating Doodles ── */}
      {DOODLES.map((doodle, i) => (
        <motion.div
          key={i}
          className="absolute opacity-40 mix-blend-screen hidden lg:block"
          style={{ top: doodle.top, left: doodle.left, right: doodle.right, width: doodle.size, height: doodle.size }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 20, -20, 0]
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: doodle.delay,
            ease: 'easeInOut'
          }}
        >
          {doodle.type === 'star' && (
            <svg viewBox="0 0 24 24" fill="none" stroke={doodle.color} strokeWidth="3" strokeLinecap="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/>
            </svg>
          )}
          {doodle.type === 'zig' && (
            <svg viewBox="0 0 24 24" fill="none" stroke={doodle.color} strokeWidth="3" strokeLinecap="square">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          )}
          {doodle.type === 'dot' && (
            <svg viewBox="0 0 24 24" fill={doodle.color}>
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
        </motion.div>
      ))}

    </div>
  )
}
