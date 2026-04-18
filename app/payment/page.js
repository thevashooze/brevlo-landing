'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'

export default function PaymentPage() {
  const router = useRouter()

  const [orderData, setOrderData] = useState(null)
  const [revisions, setRevisions] = useState(2)
  const [psdIncluded, setPsdIncluded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [briefModalOpen, setBriefModalOpen] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('brevlo_order_data')
    if (saved) {
      try { setOrderData(JSON.parse(saved)) }
      catch (_) { router.push('/requirements') }
    } else {
      router.push('/requirements')
    }
  }, [router])

  const extraRevisions = Math.max(0, revisions - 2)
  const total = 20 + extraRevisions * 5 + (psdIncluded ? 30 : 0)

  async function handlePay() {
    if (!orderData) return
    setSubmitting(true)
    setError('')

    try {
      const { form, uploadedImages } = orderData
      let brandingNotes = form.brief?.trim() || ''
      if (form.channel?.trim()) brandingNotes = `Channel: ${form.channel.trim()}\n\n${brandingNotes}`
      if (psdIncluded) brandingNotes += '\n\n[ADD-ON: PSD source file requested]'
      if (extraRevisions > 0) brandingNotes += `\n[ADD-ON: ${revisions} revisions requested]`

      const res = await fetch(`${BACKEND}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          title: form.title.trim(),
          text: brandingNotes,
          client_name: form.name.trim(),
          niche: form.niche,
          reference_images: uploadedImages?.length ? uploadedImages.map(i => i.url) : null,
          branding_notes: brandingNotes,
          payment_id: 'DUMMY-' + Date.now(),
          amount_paid: total,
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
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  if (!orderData) return null
  const { form, uploadedImages } = orderData

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>

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

      {/* Brief Modal */}
      <AnimatePresence>
        {briefModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={() => setBriefModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              style={{ background: '#fff', border: '4px solid #0A0A0A', boxShadow: '10px 10px 0 #0A0A0A', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>BRIEF</div>
                <button
                  onClick={() => setBriefModalOpen(false)}
                  style={{ background: 'none', border: '3px solid #0A0A0A', width: '32px', height: '32px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', color: '#0A0A0A', fontWeight: 700 }}
                >✕</button>
              </div>
              <p style={{ fontSize: '15px', color: '#0A0A0A', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{form.brief}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div style={{ padding: '24px 32px' }}>
        <button
          onClick={() => router.push('/requirements')}
          className="nb-btn-yellow"
          style={{ fontSize: '12px', padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          BACK
        </button>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ maxWidth: '1060px', margin: '0 auto', padding: '16px 24px 40px' }}
      >
        <div className="label-tag" style={{ display: 'inline-block', marginBottom: '20px' }}>
          STEP 02 / 02 — PAYMENT
        </div>
        <h1 style={{
          fontSize: 'clamp(3.8rem, 10vw, 8rem)',
          fontFamily: 'var(--font-rocket)',
          lineHeight: 1.0, color: '#fff', marginBottom: '14px'
        }}>
          ONE LAST STEP.<br/>
          <span style={{ color: 'var(--yellow)' }}>DONE.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', margin: 0 }}>
          Review your order. Your designer starts immediately after.
        </p>
      </motion.div>

      {/* 2-col layout */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div className="pay-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>

          {/* ── LEFT: ORDER DETAILS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <div style={{ background: '#fff', border: '4px solid #0A0A0A', boxShadow: '10px 10px 0 #0A0A0A', color: '#0A0A0A' }}>

              {/* Header */}
              <div style={{ padding: '20px 28px', borderBottom: '3px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: '4px' }}>
                  ORDER DETAILS
                </div>
                <div style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                  {form.title}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginTop: '4px' }}>
                  {form.niche} · 1 THUMBNAIL
                </div>
              </div>

              {/* Info rows */}
              {[
                ['Name', form.name],
                ['Email', form.email],
                form.channel?.trim() ? ['Channel', form.channel] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} style={{ padding: '16px 28px', borderBottom: '2px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0A', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}

              {/* References row */}
              {uploadedImages?.length > 0 && (
                <div style={{ padding: '16px 28px', borderBottom: '2px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>References</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0A' }}>
                    {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Brief row — label + READ button only, no preview text */}
              {form.brief?.trim() && (
                <div style={{ padding: '16px 28px', borderBottom: '2px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>Brief</span>
                  <button
                    onClick={() => setBriefModalOpen(true)}
                    className="read-btn"
                    style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', padding: '6px 14px', border: '2px solid #0A0A0A', background: '#fff', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'inherit', color: '#0A0A0A', transition: 'background 0.1s, color 0.1s' }}
                  >READ →</button>
                </div>
              )}

              {/* Dummy mode notice */}
              <div style={{ padding: '16px 28px', borderBottom: '2px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--orange)', marginTop: '4px', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '3px' }}>
                    TEST MODE — DUMMY PAYMENT
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5 }}>
                    No real charge. Order is live — a designer picks it up immediately.
                  </div>
                </div>
              </div>

              {/* Security */}
              <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
                  <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11 4.5-.85 8-5.75 8-11V6l-8-4z" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>
                  SECURED · Payment with paypal
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '3px solid rgba(239,68,68,0.3)', marginTop: '8px', padding: '14px 20px', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}
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
            <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', boxShadow: '12px 12px 0 var(--yellow)' }}>

              {/* ORDER SUMMARY header — bigger */}
              <div style={{ padding: '24px 24px 20px', borderBottom: '2px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--yellow)' }}>
                  ORDER SUMMARY
                </div>
              </div>

              {/* Line items */}
              <div style={{ padding: '0 24px' }}>
                <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                    Human-designed thumbnail <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>x1</span>
                  </span>
                  <span style={{ fontSize: '14px', color: '#fff', fontWeight: 800 }}>$20.00</span>
                </div>

                <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Revisions</span>
                    {extraRevisions > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--yellow)', fontWeight: 700, marginTop: '2px' }}>
                        +{extraRevisions} extra · +${extraRevisions * 5}.00
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setRevisions(r => Math.max(2, r - 1))}
                      style={{ width: '26px', height: '26px', background: revisions <= 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.15)', color: revisions <= 2 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: revisions <= 2 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', lineHeight: 1, transition: 'all 0.1s' }}
                    >−</button>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', minWidth: '16px', textAlign: 'center' }}>{revisions}</span>
                    <button
                      onClick={() => setRevisions(r => r + 1)}
                      style={{ width: '26px', height: '26px', background: 'rgba(255,230,0,0.12)', border: '2px solid rgba(255,230,0,0.3)', color: 'var(--yellow)', cursor: 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', lineHeight: 1, transition: 'all 0.1s' }}
                    >+</button>
                  </div>
                </div>

                <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Delivery</span>
                  <span style={{ fontSize: '14px', color: '#fff', fontWeight: 800 }}>24 hours</span>
                </div>
              </div>

              {/* Addons */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', marginTop: '4px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                  ADDONS
                </div>
                <button
                  onClick={() => setPsdIncluded(p => !p)}
                  style={{ width: '100%', background: psdIncluded ? 'rgba(255,230,0,0.08)' : 'transparent', border: `2px solid ${psdIncluded ? 'rgba(255,230,0,0.35)' : 'rgba(255,255,255,0.1)'}`, padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', transition: 'all 0.15s', fontFamily: 'inherit' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', flexShrink: 0, background: psdIncluded ? 'var(--yellow)' : 'transparent', border: `2px solid ${psdIncluded ? 'var(--yellow)' : 'rgba(255,255,255,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      {psdIncluded && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2.5 4-4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: psdIncluded ? 'var(--yellow)' : 'rgba(255,255,255,0.65)', textAlign: 'left' }}>Include source file / PSD</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: psdIncluded ? 'var(--yellow)' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>+$30.00</span>
                </button>
              </div>

              {/* Total */}
              <div style={{ padding: '20px 24px', borderBottom: '2px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>TOTAL</span>
                  <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--yellow)', lineHeight: 1, fontFamily: 'var(--font-body)', letterSpacing: '-0.03em' }}>${total}</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: '20px 24px' }}>
                <button
                  onClick={handlePay}
                  disabled={submitting}
                  className="nb-btn-yellow pay-btn"
                  style={{ width: '100%', fontSize: '15px', padding: '18px 24px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                >
                  {submitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'inline-block', width: '13px', height: '13px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }}
                      />
                      PROCESSING...
                    </span>
                  ) : 'PAY & ORDER →'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.18)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  TEST MODE · NO REAL CHARGE
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pay-btn {
          transition: transform 0.1s ease, box-shadow 0.1s ease !important;
        }
        .pay-btn:hover:not(:disabled) {
          transform: translate(3px, 3px) !important;
          box-shadow: 3px 3px 0 var(--black) !important;
        }
        .pay-btn:active:not(:disabled) {
          transform: translate(6px, 6px) !important;
          box-shadow: 0px 0px 0 var(--black) !important;
        }
        .read-btn:hover {
          background: #0A0A0A !important;
          color: #fff !important;
        }
        @media (max-width: 860px) {
          .pay-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
