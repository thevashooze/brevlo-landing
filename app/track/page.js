'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'
const POLL_INTERVAL = 5000 // 5s polling

// ── Map order status + designer_stage to 5-step progress ──
function getProgressStep(order) {
  if (!order) return 0
  const s = order.status
  const ds = order.designer_stage || 'Strategy'

  if (s === 'Approved') return 5
  if (s === 'Done') return 4
  if (s === 'Assigned' || s === 'Revision') {
    if (ds === 'QC') return 3
    if (ds === 'Designing') return 2
    return 1
  }
  if (s === 'Unassigned') return 0
  return 1
}

const STEPS = [
  { label: 'Order Received', sub: 'Your brief is in our system', icon: '📥' },
  { label: 'Strategy Phase', sub: 'Viral patterns being studied', icon: '🔍' },
  { label: 'Design Phase', sub: 'Photoshop layers in motion', icon: '🎨' },
  { label: 'Quality Control', sub: '5-point QC checklist in progress', icon: '✓' },
  { label: 'Under Review', sub: 'Awaiting final admin approval', icon: '👁' },
  { label: 'Delivered!', sub: 'Your thumbnail is ready', icon: '🚀' }
]

function StatusBadge({ status }) {
  const map = {
    Assigned: { label: 'In Studio', color: '#FFE600', bg: 'rgba(255,230,0,0.1)', border: 'rgba(255,230,0,0.3)' },
    Revision: { label: 'Revision Requested', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.3)' },
    Done: { label: 'Under Review', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
    Approved: { label: 'Delivered ✓', color: '#00CC6A', bg: 'rgba(0,204,106,0.1)', border: 'rgba(0,204,106,0.3)' },
    Unassigned: { label: 'Queued', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
  }
  const s = map[status] || map.Unassigned
  return (
    <span style={{
      fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: s.color, background: s.bg, border: `2px solid ${s.border}`,
      padding: '5px 14px', borderRadius: '4px'
    }}>
      {s.label}
    </span>
  )
}

function ProgressBar({ step }) {
  return (
    <div>
      {/* Bar */}
      <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          style={{
            height: '100%',
            background: step === STEPS.length - 1 ? 'var(--green)' : 'var(--yellow)',
            borderRadius: '4px',
            boxShadow: step === STEPS.length - 1 ? '0 0 12px rgba(0,204,106,0.5)' : '0 0 12px rgba(255,230,0,0.4)'
          }}
        />
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          const future = i > step
          return (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
              <div style={{
                width: '36px', height: '36px', margin: '0 auto 8px',
                border: `3px solid ${done ? 'var(--green)' : active ? 'var(--yellow)' : 'rgba(255,255,255,0.12)'}`,
                background: done ? 'rgba(0,204,106,0.15)' : active ? 'rgba(255,230,0,0.12)' : 'transparent',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.4s ease'
              }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/></svg>
                  : <span style={{ opacity: future ? 0.3 : 1 }}>{s.icon}</span>
                }
              </div>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                color: done ? 'var(--green)' : active ? 'var(--yellow)' : 'rgba(255,255,255,0.25)',
                lineHeight: 1.3, marginBottom: '2px'
              }}>{s.label}</div>
              {active && (
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{s.sub}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlId = searchParams.get('id') || ''

  const [lookupId, setLookupId] = useState(urlId)
  const [inputId, setInputId] = useState(urlId)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(!!urlId)
  const [notFound, setNotFound] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [pulse, setPulse] = useState(false)
  const prevStepRef = useRef(null)
  const intervalRef = useRef(null)

  async function fetchOrder(id) {
    if (!id) return
    try {
      const res = await fetch(`${BACKEND}/get-order/${encodeURIComponent(id)}`)
      if (!res.ok) { setNotFound(true); setOrder(null); return }
      const data = await res.json()
      const newStep = getProgressStep(data)

      // Pulse animation if step changed
      if (prevStepRef.current !== null && prevStepRef.current !== newStep) {
        setPulse(true)
        setTimeout(() => setPulse(false), 1200)
      }
      prevStepRef.current = newStep

      setOrder(data)
      setNotFound(false)
      setLastUpdated(new Date())
    } catch (_) {
      // silently fail on poll — don't disrupt existing state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!lookupId) return
    setLoading(true)
    fetchOrder(lookupId)

    intervalRef.current = setInterval(() => fetchOrder(lookupId), POLL_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [lookupId])

  function handleLookup(e) {
    e?.preventDefault()
    const id = inputId.trim().toUpperCase()
    if (!id) return
    setLookupId(id)
    router.push('/track?id=' + id, { shallow: true })
    setLoading(true)
    setNotFound(false)
    setOrder(null)
  }

  const step = getProgressStep(order)

  return (
    <main style={{ minHeight: '100vh', padding: '80px 24px 120px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '32px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          BREVLO HOME
        </a>
        <div className="label-tag" style={{ display: 'block', marginBottom: '16px', width: 'fit-content', margin: '0 auto 16px' }}>ORDER TRACKER</div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontFamily: 'var(--font-rocket)',
          lineHeight: 1.05,
          color: '#fff',
          marginBottom: '12px'
        }}>
          REAL-TIME <span style={{ color: 'var(--yellow)' }}>STATUS.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '400px', margin: '0 auto' }}>
          Enter your Order ID to see exactly where your thumbnail is right now.
        </p>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Lookup form */}
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
          <input
            type="text"
            value={inputId}
            onChange={e => setInputId(e.target.value.toUpperCase())}
            placeholder="BREVLO-XXXXXX"
            style={{
              flex: 1,
              padding: '16px 20px',
              fontSize: '18px',
              fontFamily: 'var(--font-rocket)',
              letterSpacing: '0.06em',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              border: '4px solid rgba(255,255,255,0.2)',
              borderRadius: '0',
              outline: 'none'
            }}
          />
          <button type="submit" className="nb-btn-yellow" style={{ padding: '16px 28px', fontSize: '15px', flexShrink: 0 }}>
            TRACK →
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: '40px', height: '40px', border: '4px solid rgba(255,230,0,0.2)', borderTopColor: 'var(--yellow)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              FETCHING ORDER...
            </div>
          </div>
        )}

        {/* Not found */}
        {notFound && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '48px 32px',
              border: '4px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.06)', borderRadius: '12px'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✕</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-rocket)', color: '#ef4444', marginBottom: '10px' }}>ORDER NOT FOUND</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
              Check your Order ID — it starts with BREVLO- and has 6 characters after.
            </p>
            <button onClick={() => router.push('/order')} className="nb-btn-yellow" style={{ fontSize: '14px', padding: '12px 28px' }}>
              PLACE A NEW ORDER →
            </button>
          </motion.div>
        )}

        {/* Order found */}
        <AnimatePresence>
          {order && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Order header card */}
              <motion.div
                animate={pulse ? { scale: [1, 1.01, 1] } : {}}
                transition={{ duration: 0.4 }}
                style={{
                  background: '#0A0A0A',
                  border: '4px solid var(--black)',
                  borderRadius: '12px',
                  boxShadow: `8px 8px 0 ${step === STEPS.length - 1 ? 'var(--green)' : 'var(--yellow)'}`,
                  padding: '28px 32px',
                  marginBottom: '32px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                      ORDER ID
                    </div>
                    <div style={{ fontSize: '24px', fontFamily: 'var(--font-rocket)', color: 'var(--yellow)', letterSpacing: '0.04em' }}>
                      {order.display_id || order.id}
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>VIDEO TITLE</div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{order.title}</div>
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {order.niche && (
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--purple)', background: 'rgba(160,51,255,0.1)', border: '1px solid rgba(160,51,255,0.25)', padding: '4px 12px', borderRadius: '4px' }}>
                      {order.niche}
                    </div>
                  )}
                  {order.is_dummy && (
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.25)', padding: '4px 12px', borderRadius: '4px' }}>
                      TEST ORDER
                    </div>
                  )}
                  {order.assigned_at && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                      Placed {new Date(order.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Progress bar */}
              <div style={{
                background: '#0A0A0A',
                border: '4px solid var(--black)',
                borderRadius: '12px',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.5)',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    PROGRESS — STEP {step} OF {STEPS.length - 1}
                  </div>
                  {lastUpdated && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', animation: 'liveGlow 1.5s infinite' }} />
                      LIVE · Updated {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>

                <ProgressBar step={step} />
              </div>

              {/* Thumbnail preview (if delivered) */}
              {order.thumbnail_url && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#0A0A0A',
                    border: '4px solid var(--green)',
                    borderRadius: '12px',
                    boxShadow: '8px 8px 0 var(--green)',
                    padding: '24px',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>
                    ✓ YOUR THUMBNAIL
                  </div>
                  <img
                    src={order.thumbnail_url}
                    alt="Your thumbnail"
                    style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
                  />
                  <div style={{ marginTop: '16px' }}>
                    <a
                      href={order.thumbnail_url}
                      download
                      className="nb-btn-yellow"
                      style={{ fontSize: '14px', padding: '12px 32px', textDecoration: 'none', display: 'inline-block' }}
                    >
                      DOWNLOAD THUMBNAIL →
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Revision note (if applicable) */}
              {order.status === 'Revision' && order.revision_note && (
                <div style={{
                  background: 'rgba(255,107,53,0.06)',
                  border: '3px solid rgba(255,107,53,0.3)',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '8px' }}>
                    REVISION IN PROGRESS
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    {order.revision_note.replace('[QUALITY CONTROL]: ', '').replace('[CLIENT REQUEST]: ', '')}
                  </div>
                </div>
              )}

              {/* Live poll indicator */}
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Auto-refreshes every 5 seconds · Keep this tab open for live updates
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes liveGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px var(--green); }
          50% { opacity: 0.4; box-shadow: none; }
        }
      `}</style>
    </main>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-rocket)', fontSize: '2rem', color: 'rgba(255,255,255,0.4)' }}>LOADING...</div>
      </div>
    }>
      <TrackContent />
    </Suspense>
  )
}
