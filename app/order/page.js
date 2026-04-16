'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'

const STAGES = [
  {
    num: '01',
    tag: 'STAGE ONE',
    title: 'VIRAL\nDECONSTRUCTION',
    body: 'Before a single pixel is placed, we autopsy what went viral. We study 50+ thumbnail patterns, dissect competitor click-through data, and map the exact visual triggers that made viewers stop scrolling.',
    accent: '#FFE600',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="4" y="4" width="56" height="56" rx="4" stroke="currentColor" strokeWidth="4"/>
        <path d="M16 32h32M32 16v32M20 20l24 24M44 20L20 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    stat: '50+ patterns studied per brief'
  },
  {
    num: '02',
    tag: 'STAGE TWO',
    title: 'STRATEGIC\nSKETCHING',
    body: 'No client ever sees a first draft. We sketch 3–5 raw concepts before a single layer opens in Photoshop. We route through thumbnail psychology: focal points, color contrast ratios, and mobile-first legibility.',
    accent: '#A033FF',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M8 56L22 28l12 16 10-20 12 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="28" r="4" fill="currentColor"/>
        <circle cx="34" cy="44" r="4" fill="currentColor"/>
        <circle cx="44" cy="24" r="4" fill="currentColor"/>
      </svg>
    ),
    stat: '3–5 concepts before execution'
  },
  {
    num: '03',
    tag: 'STAGE THREE',
    title: 'HIGH-FIDELITY\nEXECUTION',
    body: 'Professional Photoshop. Not Canva. Not AI. Every layer is intentional — precise shadow depths, calibrated font weights, color-graded backgrounds. Each thumbnail is built to look cinematic at 1280×720 and still punch at 120×68 mobile.',
    accent: '#FF6B35',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="6" stroke="currentColor" strokeWidth="4"/>
        <rect x="16" y="16" width="14" height="14" rx="2" fill="currentColor" opacity="0.7"/>
        <rect x="34" y="16" width="14" height="14" rx="2" fill="currentColor" opacity="0.4"/>
        <rect x="16" y="34" width="14" height="14" rx="2" fill="currentColor" opacity="0.4"/>
        <rect x="34" y="34" width="14" height="14" rx="2" fill="currentColor" opacity="0.9"/>
      </svg>
    ),
    stat: 'Professional Photoshop, zero AI generation'
  },
  {
    num: '04',
    tag: 'STAGE FOUR',
    title: 'QUALITY\nCONTROL',
    body: 'Before any thumbnail leaves our studio, it passes a 5-point QC checklist: CTR viability score, contrast accessibility check, mobile preview test, competitor gap analysis, and a final design director sign-off.',
    accent: '#00CC6A',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="4"/>
        <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    stat: '5-point QC before every delivery'
  }
]

const NICHES = ['Gaming', 'Finance', 'History', 'Vlogs', 'Tech', 'Fitness', 'Education', 'Entertainment', 'Other']

function StageCard({ stage, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
      className="section"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div className="label-tag" style={{ marginBottom: '28px' }}>{stage.tag}</div>
            <div style={{
              fontSize: 'clamp(80px, 14vw, 160px)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'rgba(255,255,255,0.06)',
              fontFamily: 'var(--font-rocket)',
              letterSpacing: '-0.04em',
              marginBottom: '-20px',
              userSelect: 'none'
            }}>{stage.num}</div>
            <h2 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontFamily: 'var(--font-rocket)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              whiteSpace: 'pre-line',
              marginBottom: '24px',
              color: '#fff'
            }}>{stage.title}</h2>
            <p style={{ fontSize: '18px', lineHeight: 1.65, color: 'rgba(255,255,255,0.72)', maxWidth: '480px', marginBottom: '32px' }}>
              {stage.body}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: stage.accent
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stage.accent, flexShrink: 0 }} />
              {stage.stat}
            </div>
          </div>

          {/* Right — large stage visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '340px',
              height: '340px',
              border: `4px solid ${stage.accent}`,
              borderRadius: '16px',
              boxShadow: `20px 20px 0 ${stage.accent}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              background: 'rgba(0,0,0,0.35)',
              color: stage.accent,
              backdropFilter: 'blur(4px)'
            }}>
              {stage.icon}
              <div style={{
                fontSize: 'clamp(3rem, 5vw, 5rem)',
                fontFamily: 'var(--font-rocket)',
                color: stage.accent,
                opacity: 0.25,
                lineHeight: 1
              }}>{stage.num}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function OrderPage() {
  const router = useRouter()
  const formRef = useRef(null)

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', title: '', niche: '', brandingNotes: ''
  })
  const [refs, setRefs] = useState([''])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Persist draft to sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('brevlo_order_draft')
    if (saved) {
      try {
        const { form: f, refs: r } = JSON.parse(saved)
        if (f) setForm(f)
        if (r) setRefs(r)
      } catch (_) {}
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('brevlo_order_draft', JSON.stringify({ form, refs }))
  }, [form, refs])

  function updateForm(key, val) {
    setForm(p => ({ ...p, [key]: val }))
    if (formErrors[key]) setFormErrors(p => ({ ...p, [key]: '' }))
  }

  function addRef() { if (refs.length < 5) setRefs(p => [...p, '']) }
  function updateRef(i, val) { setRefs(p => p.map((r, idx) => idx === i ? val : r)) }
  function removeRef(i) { setRefs(p => p.filter((_, idx) => idx !== i)) }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.niche) errs.niche = 'Select a niche'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setSubmitting(true)
    setError('')

    try {
      const cleanRefs = refs.filter(r => r.trim())
      const res = await fetch(`${BACKEND}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          title: form.title.trim(),
          text: form.brandingNotes.trim(),
          client_name: form.name.trim(),
          niche: form.niche,
          reference_urls: cleanRefs.length ? cleanRefs : null,
          branding_notes: form.brandingNotes.trim() || null,
          payment_id: 'DUMMY-' + Date.now(),
          amount_paid: 20,
          is_dummy: true
        })
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Order failed')
      }

      const data = await res.json()
      sessionStorage.removeItem('brevlo_order_draft')
      router.push('/success?id=' + (data.displayId || data.orderId))
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh' }}>

      {/* ══════════════════════════════════════
          PHASE 1 — STRATEGY SCROLL HERO
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative'
      }}>
        {/* Back link */}
        <a href="/" style={{
          position: 'absolute', top: '28px', left: '28px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)',
          textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          BACK
        </a>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="label-tag" style={{ marginBottom: '32px' }}>THE BREVLO CRAFT SYSTEM</div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 7rem)',
            fontFamily: 'var(--font-rocket)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
            marginBottom: '28px',
            color: '#fff'
          }}>
            BEFORE YOU CLICK BUY,<br />
            <span style={{ color: 'var(--yellow)' }}>UNDERSTAND THE CRAFT.</span>
          </h1>

          <p style={{
            fontSize: '20px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '600px',
            marginBottom: '48px'
          }}>
            Every $20 thumbnail goes through a 4-stage system engineered to win attention in the most competitive feed on the internet.
          </p>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            onClick={() => document.getElementById('stage-1')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 11l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          THE 4 STAGES
      ══════════════════════════════════════ */}
      {STAGES.map((stage, i) => (
        <div key={stage.num} id={i === 0 ? 'stage-1' : undefined}>
          <StageCard stage={stage} index={i} />
          {/* Divider between stages */}
          {i < STAGES.length - 1 && (
            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          )}
        </div>
      ))}

      {/* ══════════════════════════════════════
          FINAL CTA — "I'M READY"
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        background: 'var(--yellow)',
        borderTop: '6px solid var(--black)',
        borderBottom: '6px solid var(--black)'
      }}>
        {/* Dark grid overlay */}
        <div className="grid-live" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6 }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', marginBottom: '20px' }}>
            — 4 STAGES COMPLETE —
          </div>
          <h2 style={{
            fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
            fontFamily: 'var(--font-rocket)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: 'var(--black)',
            marginBottom: '40px',
            maxWidth: '900px'
          }}>
            I'M READY. LET'S BUILD MY THUMBNAIL.
          </h2>

          <button
            onClick={scrollToForm}
            className="nb-btn"
            style={{ fontSize: '18px', padding: '20px 52px', boxShadow: '8px 8px 0 var(--black)' }}
          >
            START MY ORDER →
          </button>

          <div style={{ marginTop: '40px', display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['$20 flat', 'Same-day delivery', 'Human designers', '2 free revisions'].map(item => (
              <div key={item} style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ color: 'var(--black)', fontSize: '16px' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          PHASE 2 — REQUIREMENTS LAB
      ══════════════════════════════════════ */}
      <section
        ref={formRef}
        className="section"
        style={{ paddingTop: '100px', paddingBottom: '120px' }}
      >
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="label-tag" style={{ marginBottom: '20px' }}>PHASE 2</div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontFamily: 'var(--font-rocket)',
              lineHeight: 1.05,
              color: '#fff',
              marginBottom: '16px'
            }}>REQUIREMENTS LAB</h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', maxWidth: '500px', margin: '0 auto' }}>
              The more we know, the better the thumbnail. Fill this out completely.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '48px', alignItems: 'start' }}>

            {/* ── LEFT: FORM ── */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => updateForm('name', e.target.value)}
                      placeholder="John Creator"
                      className="nb-input"
                      style={{ ...inputStyle, borderColor: formErrors.name ? 'var(--red)' : '' }}
                    />
                    {formErrors.name && <div style={errStyle}>{formErrors.name}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => updateForm('email', e.target.value)}
                      placeholder="you@email.com"
                      className="nb-input"
                      style={{ ...inputStyle, borderColor: formErrors.email ? 'var(--red)' : '' }}
                    />
                    {formErrors.email && <div style={errStyle}>{formErrors.email}</div>}
                  </div>
                </div>

                {/* Video Title */}
                <div>
                  <label style={labelStyle}>Video Title / Concept <span style={{ color: 'var(--yellow)' }}>*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => updateForm('title', e.target.value)}
                    placeholder="e.g. I Built a City in 100 Days"
                    className="nb-input"
                    style={{ ...inputStyle, borderColor: formErrors.title ? 'var(--red)' : '' }}
                  />
                  {formErrors.title && <div style={errStyle}>{formErrors.title}</div>}
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                    This is the most important field. Be specific.
                  </div>
                </div>

                {/* Niche */}
                <div>
                  <label style={labelStyle}>Content Niche <span style={{ color: 'var(--yellow)' }}>*</span></label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {NICHES.map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => { updateForm('niche', n); setFormErrors(p => ({ ...p, niche: '' })) }}
                        style={{
                          padding: '9px 18px',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          border: `3px solid ${form.niche === n ? 'var(--yellow)' : 'rgba(255,255,255,0.2)'}`,
                          background: form.niche === n ? 'var(--yellow)' : 'transparent',
                          color: form.niche === n ? 'var(--black)' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          borderRadius: '0',
                          transition: 'all 0.1s'
                        }}
                      >{n}</button>
                    ))}
                  </div>
                  {formErrors.niche && <div style={errStyle}>{formErrors.niche}</div>}
                </div>

                {/* Reference Hub */}
                <div>
                  <label style={labelStyle}>Reference Hub <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>(Optional — up to 5)</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {refs.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="url"
                          value={r}
                          onChange={e => updateRef(i, e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="nb-input"
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {refs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRef(i)}
                            style={{
                              width: '44px', height: '44px', background: 'rgba(239,68,68,0.1)',
                              border: '3px solid rgba(239,68,68,0.3)', color: 'var(--red)',
                              cursor: 'pointer', fontSize: '18px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}
                          >×</button>
                        )}
                      </div>
                    ))}
                    {refs.length < 5 && (
                      <button type="button" onClick={addRef} style={{
                        alignSelf: 'flex-start', fontSize: '12px', fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)', background: 'transparent',
                        border: '2px dashed rgba(255,255,255,0.15)', padding: '8px 16px',
                        cursor: 'pointer'
                      }}>+ ADD REFERENCE</button>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                    Thumbnails you like, style references, competitor channels.
                  </div>
                </div>

                {/* Branding Notes */}
                <div>
                  <label style={labelStyle}>Branding & Extra Notes <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>(Optional)</span></label>
                  <textarea
                    value={form.brandingNotes}
                    onChange={e => updateForm('brandingNotes', e.target.value)}
                    placeholder="Brand colors, font preferences, tone (bold/clean/dark), text to include on the thumbnail, face reveal or no..."
                    className="nb-input"
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

              </div>
            </form>

            {/* ── RIGHT: ORDER SUMMARY + PAYMENT ── */}
            <div style={{ position: 'sticky', top: '32px' }}>

              {/* Order summary card */}
              <div style={{
                background: '#0A0A0A',
                border: '4px solid var(--black)',
                borderRadius: '12px',
                boxShadow: '12px 12px 0 var(--yellow)',
                padding: '28px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: '20px' }}>
                  ORDER SUMMARY
                </div>

                {/* Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>Custom YouTube Thumbnail</span>
                  <span style={{ fontSize: '36px', fontFamily: 'var(--font-rocket)', color: '#fff' }}>$20</span>
                </div>

                {/* Includes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {[
                    ['1 × Premium Thumbnail', 'Photoshop, human-made'],
                    ['Same-day delivery', 'Within 24 hours'],
                    ['2 Free revisions', 'Any changes needed'],
                    ['Final PNG + PSD file', 'Full source file included'],
                    ['CTR-optimised design', 'Proven viral patterns']
                  ].map(([title, sub]) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '18px', height: '18px', background: 'rgba(255,230,0,0.12)', border: '2px solid var(--yellow)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#FFE600" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{title}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Test mode badge */}
                <div style={{
                  background: 'rgba(255,107,53,0.1)',
                  border: '2px solid rgba(255,107,53,0.35)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)' }}>DUMMY PAYMENT MODE ACTIVE</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>No real charge. Order still creates + assigns to designer.</div>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '2px solid rgba(239,68,68,0.3)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#ef4444',
                        fontWeight: 600
                      }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pay button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="nb-btn-yellow"
                  style={{
                    width: '100%',
                    fontSize: '16px',
                    padding: '18px 24px',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'PROCESSING ORDER...' : 'PAY $20 (TEST MODE) →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Secured by PayPal • No real charge today
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .order-grid { grid-template-columns: 1fr !important; }
          .stage-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

/* ── Shared micro styles ── */
const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '10px'
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '15px',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  borderRadius: '8px',
  border: '3px solid rgba(255,255,255,0.12)',
  transition: 'border-color 0.15s'
}

const errStyle = {
  fontSize: '12px',
  color: 'var(--red)',
  fontWeight: 700,
  marginTop: '6px',
  letterSpacing: '0.04em'
}
