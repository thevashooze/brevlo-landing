'use client'

import { useEffect, useRef } from 'react'

/*
  Animated glitch-dot canvas background.
  – Dark semi-transparent squares pulse across the surface.
  – Randomly, individual dots "glitch": jitter + flash white briefly.
  Used as absolute overlay on the bright purple hero section.
*/
export default function GlitchDots() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let t = 0
    let dots = []

    function buildDots() {
      const W = canvas.width
      const H = canvas.height
      dots = []
      // ~1 dot per 2200px² — dense enough to feel textured
      const count = Math.ceil((W * H) / 2200)
      for (let i = 0; i < count; i++) {
        dots.push({
          x:          Math.random() * W,
          y:          Math.random() * H,
          s:          Math.random() * 3.5 + 1.5,
          baseAlpha:  Math.random() * 0.28 + 0.06,
          phase:      Math.random() * Math.PI * 2,
          freq:       Math.random() * 0.25 + 0.1,
          glitch:     0,
          glitchLen:  0,
          gx:         0,
          gy:         0,
        })
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width  * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      buildDots()
    }

    resize()
    window.addEventListener('resize', resize)

    function frame() {
      const W = canvas.width  / (window.devicePixelRatio || 1)
      const H = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, W, H)
      t += 0.012

      for (const d of dots) {
        // Trigger glitch randomly
        if (d.glitch === 0 && Math.random() < 0.00035) {
          d.glitch    = 1
          d.glitchLen = Math.floor(Math.random() * 18) + 8
          d.gx        = d.x
          d.gy        = d.y
        }

        if (d.glitch > 0) {
          d.glitch++
          const progress = d.glitch / d.glitchLen

          if (d.glitch >= d.glitchLen) { d.glitch = 0 }

          // Flash in then out
          const alpha = progress < 0.4 ? progress / 0.4 : (1 - progress) / 0.6
          const jx    = d.gx + (Math.random() - 0.5) * 10
          const jy    = d.gy + (Math.random() - 0.5) * 10

          ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
          ctx.fillStyle   = '#ffffff'
          ctx.fillRect(jx, jy, d.s * 1.6, d.s * 1.6)
        } else {
          // Normal: dark dot with slow breathing
          const alpha = d.baseAlpha * (0.5 + 0.5 * Math.sin(t * d.freq + d.phase))
          ctx.globalAlpha = alpha
          ctx.fillStyle   = 'rgba(0,0,0,1)'
          ctx.fillRect(d.x, d.y, d.s, d.s)
        }
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(frame)
    }

    frame()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        1,
      }}
    />
  )
}
