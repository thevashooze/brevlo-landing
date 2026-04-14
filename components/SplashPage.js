'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SHAPES = [
  { type: 'circle', color: '#FFE600', top: '14%', left: '4%',   size: 44, delay: 0 },
  { type: 'square', color: '#FFE600', top: '20%', right: '6%',  size: 36, delay: 0.8 },
  { type: 'cross',  color: '#fff',    top: '68%', left: '6%',   size: 28, delay: 0.4 },
  { type: 'circle', color: '#D4AAFF', top: '72%', right: '4%',  size: 22, delay: 1.2 },
  { type: 'square', color: '#fff',    top: '46%', left: '1.5%', size: 14, delay: 1.6 },
  { type: 'cross',  color: '#FFE600', top: '33%', right: '2%',  size: 18, delay: 2.0 },
]

export default function SplashPage() {
  const { scrollY } = useScroll()

  // Big BREVLO scrolls out upward
  const bigLogoOpacity = useTransform(scrollY, [0, 350], [1, 0])
  const bigLogoY       = useTransform(scrollY, [0, 350], [0, -60])
  const bigLogoScale   = useTransform(scrollY, [0, 350], [1, 0.8])

  // RAF + lerp for smooth cursor shadow — always yellow
  const targetRef  = useRef({ x: 8, y: 8 })
  const currentRef = useRef({ x: 8, y: 8 })
  const rafRef     = useRef(null)
  const [shadowPos, setShadowPos] = useState({ x: 8, y: 8 })

  useEffect(() => {
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08
      setShadowPos({ x: currentRef.current.x, y: currentRef.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const onMove = useCallback((e) => {
    const cx = e.clientX / window.innerWidth
    const cy = e.clientY / window.innerHeight
    targetRef.current = {
      x: -(cx - 0.5) * 60,
      y: -(cy - 0.5) * 60,
    }
  }, [])

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={onMove}
    >
      {/* Floating shapes */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {SHAPES.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: s.top, left: s.left, right: s.right }}
            animate={{ y: [0, -18, 0], rotate: s.type === 'square' ? [0, 45, 0] : [0, 0, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, repeatType: 'reverse', delay: s.delay, ease: 'easeInOut' }}
          >
            {s.type === 'circle' && (
              <div style={{ width: s.size, height: s.size, borderRadius: '50%', background: s.color, border: '3px solid rgba(255,255,255,0.3)', boxShadow: '3px 3px 0 rgba(0,0,0,0.2)' }} />
            )}
            {s.type === 'square' && (
              <div style={{ width: s.size, height: s.size, background: s.color, border: '3px solid rgba(255,255,255,0.3)', boxShadow: '3px 3px 0 rgba(0,0,0,0.2)' }} />
            )}
            {s.type === 'cross' && (
              <div className="relative" style={{ width: s.size, height: s.size }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '8px', marginTop: '-4px', background: s.color, borderRadius: '4px' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '8px', marginLeft: '-4px', background: s.color, borderRadius: '4px' }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Big BREVLO — scrolls out */}
      <motion.div
        style={{ opacity: bigLogoOpacity, y: bigLogoY, scale: bigLogoScale }}
        className="flex flex-col items-center gap-6 select-none"
      >
        <h1
          className="font-rocket text-white leading-none"
          style={{
            fontSize: 'clamp(5rem, 22vw, 18rem)',
            textShadow: `${shadowPos.x}px ${shadowPos.y}px 0 #FFE600`,
          }}
        >
          BREVLO
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white font-black text-sm uppercase tracking-[0.3em]"
        >
          Pure CTR. Human Craft.
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-white/30 font-black text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          className="w-px h-10 bg-white/20"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}
