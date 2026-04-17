'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'

const INCLUDES = [
  ['1 × Premium Thumbnail', 'Human-made in Photoshop'],
  ['JPG + Web-Ready Export', 'High-res, optimised for YouTube'],
  ['Same-day delivery', 'Within 24 hours guaranteed'],
  ['2 Free revisions', 'Any changes needed'],
  ['CTR-optimised design', 'Proven viral patterns'],
]

export default function PaymentPage() {
  const router = useRouter()

  const [orderData, setOrderData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('brevlo_order_data')
    if (saved) {
      try { setOrderData(JSON.parse(saved)) }
      catch (_) { router.push('/requirements') }
    } else {
      router.push('/requirements')
    }
  }, [router])

  async function handlePay() {
    if (!orderData) return
    setSubmitting(true)
    setError('')

    try {
      const { form, refs, uploadedImages } = orderData
      const res = await fetch(`${BACKEND}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          title: form.title.trim(),
          text: form.brandingNotes?.trim() || '',
          client_name: form.name.trim(),
          niche: form.niche,
          reference_urls: refs?.length ? refs : null,
          reference_images: uploadedImages?.length ? uploadedImages.map(i => i.url) : null,
          branding_notes: form.brandingNotes?.trim() || null,
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
      sessionStorage.removeItem('brevlo_req_draft')
      sessionStorage.removeItem('brevlo_order_data')

      setTransitioning(true)
      setTimeout(() => router.push('/success?id=' + (data.displayId || data.orderId)), 500)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  if (!orderData) return null

  const { form } = orderData

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Exit transition */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'fixed', inset: 0, background: 'var(--yellow)', zIndex: 9999, transformOrigin: 'bottom' }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '4px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: '16px',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <button
          onClick={() => router.push('/requirements')}
          style={{
            fontSize: '12px', padding: '9px 16px',
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            color: '#fff', background: 'transparent',
            border: '3px solid rgba(255,255,255,0.2)', cursor: 'pointer',
            fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'inherit'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          EDIT BRIEF
        </button>
        <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.12)' }}/>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          PAYMENT
        </div>
        {/* Step indicator */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.5)'
            }}>✓</div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>BRIEF</span>
          </div>
          <div style={{ width: '32px', height: '2px', background: 'var(--yellow)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', background: 'var(--yellow)', border: '2px solid var(--black)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 900, color: 'var(--black)'
            }}>2</div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--yellow)' }}>PAYMENT</span>
          </div>
        </div>
      </div>

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{ textAlign: 'center', padding: '56px 24px 44px' }}
      >
        <div className="label-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto 16px' }}>STEP 02 / 02 — PAYMENT</div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-rocket)',
          lineHeight: 1.0, color: '#fff', marginBottom: '14px'
        }}>
          ONE LAST STEP. <span style={{ color: 'var(--yellow)' }}>$20. DONE.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '400px', margin: '0 auto' }}>
          Review your order and pay. Your designer starts immediately after.
        </p>
      </motion.div>

      {/* Main 2-col layout */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px', alignItems: 'start' }}>

          {/* ── LEFT: PAYMENT ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            {/* Dummy mode notice */}
            <div style={{
              background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'flex-start', gap: '14px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', marginTop: '3px', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '4px' }}>
                  TEST MODE — DUMMY PAYMENT
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  No real charge. Your order is live — a designer picks it up immediately. PayPal integration coming soon.
                </div>
              </div>
            </div>

            {/* Order confirmation */}
            <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px', borderTop: 'none' }}>
              <div style={sectionHeader}>
                <span style={sectionNum}>01 /</span>
                <span style={sectionLabel}>ORDER CONFIRMATION</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '14px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Client</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{form.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '14px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Email</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{form.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '2px solid rgba(255,255,255,0.06)', gap: '20px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, flexShrink: 0 }}>Video</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', textAlign: 'right' }}>{form.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Niche</span>
                  <span style={{
                    fontSize: '12px', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'var(--yellow)', color: 'var(--black)', padding: '4px 10px',
                    border: '2px solid var(--black)'
                  }}>{form.niche}</span>
                </div>
              </div>
            </div>

            {/* Security + trust */}
            <div style={{
              background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '20px 24px',
              borderTop: 'none', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11 4.5-.85 8-5.75 8-11V6l-8-4z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                SECURED · NO REAL CHARGE · REFUND ANYTIME
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(239,68,68,0.08)', border: '3px solid rgba(239,68,68,0.25)', borderTop: 'none', padding: '14px 24px', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ position: 'sticky', top: '32px' }}
          >
            <div style={{
              background: '#0A0A0A',
              border: '4px solid rgba(255,255,255,0.1)',
              boxShadow: '12px 12px 0 var(--yellow)'
            }}>
              {/* Header */}
              <div style={{ padding: '24px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)' }}>
                <div style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontFamily: 'var(--font-rocket)',
                  color: 'var(--yellow)',
                  letterSpacing: '0.02em',
                  marginBottom: '4px'
                }}>ORDER SUMMARY</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>1 custom YouTube thumbnail</div>
              </div>

              {/* Video title + niche */}
              <div style={{ padding: '18px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '6px' }}>
                  {form.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: 'rgba(255,230,0,0.1)', color: 'var(--yellow)',
                    border: '2px solid rgba(255,230,0,0.25)', padding: '3px 8px'
                  }}>{form.niche}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>· 1 Thumbnail</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ padding: '20px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>Total</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '52px', fontFamily: 'var(--font-rocket)', color: 'var(--yellow)', lineHeight: 1 }}>$20</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>USD</span>
                  </div>
                </div>
              </div>

              {/* Includes */}
              <div style={{ padding: '20px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>
                  WHAT'S INCLUDED
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {INCLUDES.map(([title, sub]) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '18px', height: '18px', flexShrink: 0, marginTop: '1px',
                        background: 'rgba(255,230,0,0.1)', border: '2px solid rgba(255,230,0,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5l2 2 4-4" stroke="#FFE600" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{title}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PSD upsell */}
              <div style={{ padding: '14px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                  Want the <strong style={{ color: 'rgba(255,255,255,0.5)' }}>PSD source file</strong>? Add it for +$15 — mention it in your branding notes.
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: '20px 28px' }}>
                <motion.button
                  onClick={handlePay}
                  disabled={submitting}
                  className="nb-btn-yellow"
                  style={{ width: '100%', fontSize: '17px', padding: '20px 24px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  whileHover={!submitting ? { x: 3, y: 3, boxShadow: '4px 4px 0 var(--black)' } : {}}
                  whileTap={!submitting ? { x: 6, y: 6, boxShadow: '0px 0px 0 var(--black)' } : {}}
                >
                  {submitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }}
                      />
                      PROCESSING...
                    </span>
                  ) : 'PAY $20 & START MY ORDER →'}
                </motion.button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  TEST MODE · NO REAL CHARGE
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 900px) {
          .pay-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

/* ── Micro styles ── */
const sectionHeader = {
  display: 'flex', alignItems: 'center', gap: '10px',
  marginBottom: '20px', paddingBottom: '14px',
  borderBottom: '2px solid rgba(255,255,255,0.06)'
}
const sectionNum = {
  fontSize: '11px', fontWeight: 900, color: 'var(--yellow)',
  fontFamily: 'monospace', letterSpacing: '0.05em'
}
const sectionLabel = {
  fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)'
}
