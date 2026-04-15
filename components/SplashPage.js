'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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
      x: -(cx - 0.5) * 72,
      y: -(cy - 0.5) * 72,
    }
  }, [])

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={onMove}
    >
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
