'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const STAGES = [
  {
    num: '01',
    tag: 'STAGE ONE',
    title: 'VIRAL\nDECONSTRUCTION',
    body: 'Before a single pixel is placed, we autopsy what went viral. We study 50+ thumbnail patterns, dissect competitor click-through data, and map the exact visual triggers that made viewers stop scrolling.',
    accent: '#FFE600',
    stat: '50+ patterns studied per brief',
    visual: <AnalysisVisual />
  },
  {
    num: '02',
    tag: 'STAGE TWO',
    title: 'STRATEGIC\nSKETCHING',
    body: 'No client ever sees a first draft. We sketch 3–5 raw concepts before a single layer opens in Photoshop. We route through thumbnail psychology: focal points, color contrast ratios, and mobile-first legibility.',
    accent: '#A033FF',
    stat: '3–5 concepts before execution',
    visual: <SketchVisual />
  },
  {
    num: '03',
    tag: 'STAGE THREE',
    title: 'HIGH-FIDELITY\nEXECUTION',
    body: 'We use professional Photoshop software for every project. Not Canva. Not AI. Every layer is completely intentional with precise shadow depths, calibrated font weights, and color-graded backgrounds.',
    accent: '#FF6B35',
    stat: 'Professional Photoshop Execution',
    visual: <LayersVisual />
  },
  {
    num: '04',
    tag: 'STAGE FOUR',
    title: 'QUALITY\nCONTROL',
    body: 'Before any thumbnail leaves our studio, it passes a 5-point QC checklist: CTR viability score, contrast accessibility check, mobile preview test, competitor gap analysis, and a final design director sign-off.',
    accent: '#00CC6A',
    stat: '5-point QC before every delivery',
    visual: <QCVisual />
  }
]

// ── Stage visual components ──

function AnalysisVisual() {
  const bars = [
    { label: 'CURIOSITY GAP', pct: 94, color: '#FFE600' },
    { label: 'FACE + EMOTION', pct: 87, color: '#FFE600' },
    { label: 'TEXT CONTRAST', pct: 82, color: 'rgba(255,230,0,0.5)' },
    { label: 'COLOR SHOCK', pct: 76, color: 'rgba(255,230,0,0.5)' },
    { label: 'MOBILE LEGIB.', pct: 91, color: '#FFE600' },
  ]
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {bars.map((b, i) => (
        <motion.div key={b.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>{b.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: b.color, fontFamily: 'var(--font-rocket)' }}>{b.pct}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${b.pct}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              style={{ height: '100%', background: b.color }}
            />
          </div>
        </motion.div>
      ))}
      <div style={{ marginTop: '8px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
        VIRAL PATTERN ANALYSIS — UPDATED PER BRIEF
      </div>
    </div>
  )
}

function SketchVisual() {
  return (
    <div style={{ width: '100%', aspectRatio: '16/9', border: '3px solid rgba(160,51,255,0.3)', background: 'rgba(160,51,255,0.04)', position: 'relative', overflow: 'hidden' }}>
      {/* Sketch wireframe grid lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <line x1="0" y1="33%" x2="100%" y2="33%" stroke="#A033FF" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#A033FF" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="33%" y1="0" x2="33%" y2="100%" stroke="#A033FF" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="66%" y1="0" x2="66%" y2="100%" stroke="#A033FF" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
      {/* Face placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        style={{ position: 'absolute', left: '8%', top: '15%', width: '32%', height: '70%', border: '2px dashed rgba(160,51,255,0.5)', background: 'rgba(160,51,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(160,51,255,0.6)', textTransform: 'uppercase' }}>FACE</span>
      </motion.div>
      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
        style={{ position: 'absolute', left: '44%', top: '18%', width: '48%', display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <div style={{ height: '20px', background: 'rgba(160,51,255,0.3)', width: '100%' }} />
        <div style={{ height: '20px', background: 'rgba(160,51,255,0.2)', width: '80%' }} />
        <div style={{ height: '12px', background: 'rgba(160,51,255,0.12)', width: '60%', marginTop: '6px' }} />
      </motion.div>
      {/* Focal point dot */}
      <motion.div
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
        style={{ position: 'absolute', left: '24%', top: '38%', width: '14px', height: '14px', borderRadius: '50%', background: '#A033FF', boxShadow: '0 0 12px rgba(160,51,255,0.6)' }}
      />
      {/* Draft stamp */}
      <div style={{ position: 'absolute', right: '8px', bottom: '8px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: 'rgba(160,51,255,0.35)', textTransform: 'uppercase', border: '1px solid rgba(160,51,255,0.2)', padding: '2px 6px' }}>
        CONCEPT DRAFT v2
      </div>
    </div>
  )
}

function LayersVisual() {
  const layers = [
    { name: 'BACKGROUND GRADE', color: '#FF6B35', opacity: 1 },
    { name: 'SUBJECT CUTOUT', color: '#FF6B35', opacity: 0.75 },
    { name: 'TEXT — HEADLINE', color: '#FF6B35', opacity: 0.9 },
    { name: 'DROP SHADOW', color: '#FF6B35', opacity: 0.5 },
    { name: 'COLOR OVERLAY', color: '#FF6B35', opacity: 0.6 },
    { name: 'ADJUSTMENT LAYER', color: '#FF6B35', opacity: 0.4 },
  ]
  return (
    <div style={{ width: '100%', fontFamily: '"DM Mono", monospace' }}>
      <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: '12px', textTransform: 'uppercase' }}>
        PHOTOSHOP — LAYERS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {layers.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', background: i === 2 ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.03)',
              border: i === 2 ? '1px solid rgba(255,107,53,0.3)' : '1px solid rgba(255,255,255,0.04)'
            }}
          >
            <div style={{ width: '24px', height: '16px', background: `rgba(255,107,53,${l.opacity * 0.7})`, flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', color: i === 2 ? 'rgba(255,107,53,0.9)' : 'rgba(255,255,255,0.35)', flex: 1 }}>{l.name}</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{Math.round(l.opacity * 100)}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function QCVisual() {
  const checks = [
    { label: 'CTR VIABILITY SCORE', pass: true },
    { label: 'CONTRAST RATIO CHECK', pass: true },
    { label: 'MOBILE PREVIEW TEST', pass: true },
    { label: 'COMPETITOR GAP ANALYSIS', pass: true },
    { label: 'DIRECTOR SIGN-OFF', pass: true },
  ]
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: '16px', textTransform: 'uppercase' }}>
        5-POINT QC CHECKLIST
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {checks.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 400 }}
              style={{
                width: '22px', height: '22px', flexShrink: 0,
                background: 'rgba(0,204,106,0.12)', border: '2px solid rgba(0,204,106,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2.5 4-4.5" stroke="#00CC6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.65)' }}>{c.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StageCard({ stage, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isEven = index % 2 === 0

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
      className="section"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          direction: isEven ? 'ltr' : 'rtl'
        }}>
          {/* Text side */}
          <div style={{ direction: 'ltr' }}>
            <div className="label-tag" style={{ marginBottom: '28px' }}>{stage.tag}</div>
            <div style={{
              fontSize: 'clamp(80px, 12vw, 140px)', fontWeight: 900, lineHeight: 1,
              color: 'var(--yellow)', textShadow: '6px 6px 0px rgba(0,0,0,0.4)', fontFamily: 'var(--font-rocket)',
              letterSpacing: '-0.04em', marginBottom: '-16px', userSelect: 'none'
            }}>{stage.num}</div>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', fontFamily: 'var(--font-rocket)',
              lineHeight: 1.05, letterSpacing: '-0.02em', whiteSpace: 'pre-line',
              marginBottom: '22px', color: '#fff'
            }}>{stage.title}</h2>
            <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', maxWidth: '480px', marginBottom: '32px' }}>
              {stage.body}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'transparent', border: `2px solid ${stage.accent}`,
              padding: '10px 18px', fontSize: '12px', fontWeight: 800,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: stage.accent
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stage.accent, flexShrink: 0 }} />
              {stage.stat}
            </div>
          </div>

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            style={{
              direction: 'ltr',
              padding: '36px',
              border: `4px solid #fff`,
              boxShadow: `16px 16px 0 ${stage.accent}`,
              background: '#0A0A0A',
              minHeight: '260px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {stage.visual}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default function OrderPage() {
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false)

  function handleStartOrder() {
    setTransitioning(true)
    setTimeout(() => router.push('/requirements'), 520)
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Full-screen CTA transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, originY: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0, background: 'var(--yellow)',
              zIndex: 9999, transformOrigin: 'bottom'
            }}
          />
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 24px 80px', position: 'relative'
      }}>
        {/* Back button */}
        <a href="/" className="nb-btn-yellow" style={{
          position: 'absolute', top: '28px', left: '28px',
          fontSize: '12px', padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none'
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          BACK
        </a>

        {/* Skip & Order — top right, same position as ORDER NOW on landing */}
        <button onClick={handleStartOrder} className="nb-btn-yellow" style={{
          position: 'absolute', top: '28px', right: '28px',
          fontSize: '12px', padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', fontFamily: 'inherit'
        }}>
          SKIP & ORDER →
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="label-tag" style={{ marginBottom: '32px' }}>THE BREVLO CRAFT SYSTEM</div>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 7rem)', fontFamily: 'var(--font-rocket)',
            lineHeight: 1.0, letterSpacing: '-0.02em', maxWidth: '900px',
            marginBottom: '28px', color: '#fff'
          }}>
            BEFORE YOU BUY,<br />
            <span style={{ color: 'var(--yellow)' }}>UNDERSTAND THE CRAFT.</span>
          </h1>
          <p style={{ fontSize: '20px', lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: '580px', marginBottom: '48px', marginLeft: 'auto', marginRight: 'auto' }}>
            Every $20 thumbnail goes through a 4-stage system engineered to win attention in the most competitive feed on the internet.
          </p>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
            onClick={() => document.getElementById('stage-1')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 11l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── THE 4 STAGES ── */}
      {STAGES.map((stage, i) => (
        <div key={stage.num} id={i === 0 ? 'stage-1' : undefined}>
          <StageCard stage={stage} index={i} />
          {i < STAGES.length - 1 && (
            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          )}
        </div>
      ))}

      {/* ── FINAL CTA ── */}
      <section style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '80px 24px', position: 'relative',
        background: 'transparent'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
            — 4 STAGES. ONE THUMBNAIL. —
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontFamily: 'var(--font-rocket)',
            lineHeight: 1.0, letterSpacing: '-0.02em', color: '#fff',
            marginBottom: '44px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto'
          }}>
            Ready?<br />To make Your content fly?
          </h2>

          <button
            onClick={handleStartOrder}
            className="nb-btn-yellow"
            style={{ fontSize: '18px', padding: '20px 56px' }}
          >
            START MY ORDER →
          </button>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .stage-grid { grid-template-columns: 1fr !important; direction: ltr !important; }
        }
      `}</style>
    </main>
  )
}
