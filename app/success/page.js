'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id') || ''
  const [copied, setCopied] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [confettiPieces] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.5 + Math.random() * 1.5,
      color: ['#FFE600', '#A033FF', '#FF6B35', '#00CC6A', '#fff'][Math.floor(Math.random() * 5)],
      size: 6 + Math.random() * 10,
      rotate: Math.random() * 360
    }))
  )

  useEffect(() => {
    const t = setTimeout(() => setShowUpsell(true), 2200)
    return () => clearTimeout(t)
  }, [])

  function copyId() {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!orderId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-rocket)', fontSize: '3rem', marginBottom: '16px' }}>NO ORDER FOUND</h1>
          <button onClick={() => router.push('/order')} className="nb-btn-yellow" style={{ padding: '14px 32px', fontSize: '15px' }}>
            PLACE AN ORDER →
          </button>
        </div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Confetti */}
      {confettiPieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: p.rotate }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'fixed',
            top: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            border: '2px solid rgba(0,0,0,0.3)',
            zIndex: 100,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* ── MAIN SUCCESS SECTION ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{ maxWidth: '680px', width: '100%' }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              width: '96px', height: '96px',
              background: 'var(--yellow)',
              border: '4px solid var(--black)',
              boxShadow: '6px 6px 0 var(--black)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '48px'
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M10 24l10 10 18-18" stroke="var(--black)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          {/* Heading */}
          <div className="label-tag" style={{ marginBottom: '20px' }}>ORDER CONFIRMED</div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            fontFamily: 'var(--font-rocket)',
            lineHeight: 1.0,
            color: '#fff',
            marginBottom: '16px'
          }}>
            YOUR THUMBNAIL IS<br /><span style={{ color: 'var(--yellow)' }}>IN THE STUDIO.</span>
          </h1>
          <p style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)', marginBottom: '48px' }}>
            You&apos;re in queue.
          </p>

          {/* Order ID card */}
          <div style={{
            background: '#0A0A0A',
            border: '4px solid var(--black)',
            borderRadius: '12px',
            boxShadow: '8px 8px 0 var(--yellow)',
            padding: '28px 32px',
            marginBottom: '32px',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            minWidth: '340px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
              YOUR ORDER ID
            </div>
            <div style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontFamily: 'var(--font-rocket)',
              color: 'var(--yellow)',
              letterSpacing: '0.04em'
            }}>
              {orderId}
            </div>
            <button
              onClick={copyId}
              style={{
                fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: copied ? 'var(--green)' : 'rgba(255,255,255,0.4)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                {copied
                  ? <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  : <><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
                }
              </svg>
              {copied ? 'COPIED!' : 'COPY ORDER ID'}
            </button>
          </div>

          {/* Save prompt */}
          <div style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.4)',
            marginBottom: '40px', fontWeight: 600, letterSpacing: '0.04em'
          }}>
            Save this ID to track your order. You'll also receive updates via email.
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/track?id=' + orderId)}
              className="nb-btn-yellow"
              style={{ fontSize: '15px', padding: '16px 36px' }}
            >
              TRACK MY ORDER →
            </button>
            <a
              href="/"
              className="nb-btn"
              style={{ fontSize: '15px', padding: '16px 36px', textDecoration: 'none' }}
            >
              BACK TO HOME
            </a>
          </div>
        </motion.div>
      </section>

      {/* Dashboard upsell — full-width section */}
      <AnimatePresence>
        {showUpsell && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              background: '#0A0A0A',
              borderTop: '4px solid rgba(255,255,255,0.08)',
              padding: '64px 24px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowUpsell(false)}
              style={{
                position: 'absolute', top: '20px', right: '24px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.3)', fontSize: '18px', lineHeight: 1,
                padding: '4px', fontWeight: 700
              }}
            >✕</button>

            <div style={{ maxWidth: '1060px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'center' }}>
              <div>
                <div className="label-tag" style={{ display: 'inline-block', marginBottom: '20px' }}>BREVLO DASHBOARD</div>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                  fontFamily: 'var(--font-rocket)',
                  lineHeight: 1.05, color: '#fff', marginBottom: '16px'
                }}>
                  GET YOUR BREVLO DASHBOARD.
                </h2>
                <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', marginBottom: '28px', maxWidth: '480px', lineHeight: 1.65 }}>
                  Live order tracking. 1-click revision requests. Order history in one place. Free, takes 10 seconds.
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {[['⚡', 'Live order tracking'], ['↩', '1-click revisions'], ['📦', 'Full order history']].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                      <span>{icon}</span> {text}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => router.push('/track?id=' + orderId)} className="nb-btn-yellow" style={{ fontSize: '15px', padding: '16px 36px' }}>
                    TRACK MY ORDER →
                  </button>
                  <button onClick={() => setShowUpsell(false)} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    No thanks
                  </button>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: '240px', background: '#111', border: '3px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '18px', boxShadow: '8px 8px 0 var(--yellow)', transform: 'rotate(2deg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--yellow)', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>BREVLO DASHBOARD</div>
                      <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>Order tracker</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '7px' }}>ACTIVE ORDER</div>
                  <div style={{ background: 'rgba(255,230,0,0.08)', border: '1px solid rgba(255,230,0,0.2)', borderRadius: '5px', padding: '8px 10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--yellow)', fontWeight: 700 }}>{orderId}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>In Studio</div>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '40%', background: 'var(--yellow)', borderRadius: '2px' }} />
                  </div>
                  {['Strategy ✓', 'Designing...', 'Quality Check', 'Delivered'].map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '3px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: i === 0 ? 'var(--green)' : i === 1 ? 'var(--yellow)' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                      <div style={{ fontSize: '9px', color: i <= 1 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-rocket)', fontSize: '2rem', color: 'rgba(255,255,255,0.4)' }}>LOADING...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
