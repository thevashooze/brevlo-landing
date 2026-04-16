'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'
const POLL_INTERVAL = 5000

// Diagonal tiled watermark — SVG data URI
const WATERMARK_BG = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100"><text x="120" y="50" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="13" font-weight="900" letter-spacing="5" fill="rgba(255,255,255,0.13)" transform="rotate(-30,120,50)">BREVLO PREVIEW</text></svg>')}")`

function getProgressStep(order) {
  if (!order) return 0
  const s = order.status
  const ds = order.designer_stage || 'Strategy'
  if (s === 'Completed') return 6
  if (s === 'Approved') return 5
  if (s === 'Done') return 4
  if (s === 'Assigned' || s === 'Revision') {
    if (ds === 'QC') return 3
    if (ds === 'Designing') return 2
    return 1
  }
  return 0
}

const STEPS = [
  { label: 'Received',    sub: 'Brief in system' },
  { label: 'Strategy',    sub: 'Analysing patterns' },
  { label: 'Designing',   sub: 'In Photoshop' },
  { label: 'QC',          sub: 'Internal review' },
  { label: 'Admin Review',sub: 'Final approval' },
  { label: 'Delivered',   sub: 'Ready to download' },
  { label: 'Completed',   sub: 'Delivery accepted' }
]

const STATUS_MAP = {
  Assigned:   { label: 'In Studio',          color: '#FFE600', bg: 'rgba(255,230,0,0.08)',  border: 'rgba(255,230,0,0.25)' },
  Revision:   { label: 'Revision',           color: '#FF6B35', bg: 'rgba(255,107,53,0.08)', border: 'rgba(255,107,53,0.25)' },
  Done:       { label: 'Under Review',        color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
  Approved:   { label: 'Delivered ✓',         color: '#00CC6A', bg: 'rgba(0,204,106,0.08)',  border: 'rgba(0,204,106,0.25)' },
  Completed:  { label: 'Accepted ✓',          color: '#00CC6A', bg: 'rgba(0,204,106,0.08)',  border: 'rgba(0,204,106,0.25)' },
  Unassigned: { label: 'Queued',              color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.1)' },
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.Unassigned
  return (
    <span style={{
      fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
      color: s.color, background: s.bg, border: `2px solid ${s.border}`,
      padding: '4px 12px', borderRadius: '0'
    }}>{s.label}</span>
  )
}

function ProgressRail({ step }) {
  const pct = (step / (STEPS.length - 1)) * 100
  const isDelivered = step >= 5
  return (
    <div style={{ marginBottom: '36px' }}>
      {/* Rail */}
      <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.07)', marginBottom: '28px' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
          style={{
            height: '100%',
            background: isDelivered ? '#00CC6A' : '#FFE600',
            boxShadow: isDelivered ? '0 0 10px rgba(0,204,106,0.4)' : '0 0 10px rgba(255,230,0,0.35)'
          }}
        />
        {/* Dots on rail */}
        {STEPS.map((_, i) => {
          const done = i < step, active = i === step
          return (
            <div key={i} style={{
              position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
              left: `${(i / (STEPS.length - 1)) * 100}%`,
              width: active ? '12px' : '8px', height: active ? '12px' : '8px',
              borderRadius: '50%',
              background: done ? '#00CC6A' : active ? (isDelivered ? '#00CC6A' : '#FFE600') : 'rgba(255,255,255,0.12)',
              border: active ? `2px solid ${isDelivered ? '#00CC6A' : '#FFE600'}` : 'none',
              transition: 'all 0.4s ease', zIndex: 2
            }} />
          )
        })}
      </div>
      {/* Step labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {STEPS.map((s, i) => {
          const done = i < step, active = i === step
          return (
            <div key={i} style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                color: done ? '#00CC6A' : active ? (isDelivered ? '#00CC6A' : '#FFE600') : 'rgba(255,255,255,0.2)',
                lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px'
              }}>{s.label}</div>
              {active && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.sub}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 1: Order summary card (click to expand tracking) ──
function OrderCard({ order, onExpand }) {
  const step = getProgressStep(order)
  const isDelivered = order.status === 'Approved' || order.status === 'Completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      onClick={onExpand}
      style={{
        background: '#0A0A0A',
        border: `4px solid ${isDelivered ? 'var(--green)' : 'rgba(255,255,255,0.12)'}`,
        boxShadow: `8px 8px 0 ${isDelivered ? 'var(--green)' : 'var(--yellow)'}`,
        padding: '28px 32px',
        cursor: 'pointer',
        transition: 'transform 0.12s, box-shadow 0.12s'
      }}
      whileHover={{ x: 4, y: 4, boxShadow: `4px 4px 0 ${isDelivered ? 'var(--green)' : 'var(--yellow)'}` }}
      whileTap={{ x: 8, y: 8, boxShadow: '0px 0px 0 var(--yellow)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>ORDER ID</div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-rocket)', color: 'var(--yellow)', letterSpacing: '0.04em' }}>
            {order.display_id || order.id}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '5px' }}>VIDEO TITLE</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{order.title}</div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {order.niche && (
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--purple)', background: 'rgba(160,51,255,0.1)', border: '2px solid rgba(160,51,255,0.2)', padding: '3px 10px' }}>
            {order.niche}
          </span>
        )}
        {order.assigned_at && (
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            {new Date(order.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 700, color: isDelivered ? 'var(--green)' : 'var(--yellow)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          VIEW LIVE STATUS
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// ── Star rating component ──
function StarRating({ rating, onRate }) {
  const [hover, setHover] = useState(0)
  const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1,2,3,4,5].map(n => {
        const filled = n <= (hover || rating)
        return (
          <button
            key={n}
            onClick={() => onRate(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.1s', transform: hover === n ? 'scale(1.2)' : 'scale(1)' }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path d={starPath}
                fill={filled ? '#FFE600' : 'transparent'}
                stroke={filled ? '#FFE600' : 'rgba(255,255,255,0.25)'}
                strokeWidth="1.5" strokeLinejoin="round"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

// ── Step 2: Live tracking panel ──
function TrackingPanel({ order, onBack, onOrderUpdate }) {
  const [revNote, setRevNote] = useState('')
  const [showRevForm, setShowRevForm] = useState(false)
  const [revSubmitting, setRevSubmitting] = useState(false)
  const [revError, setRevError] = useState('')
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(order.status === 'Completed')
  const [showReview, setShowReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewDone, setReviewDone] = useState(!!order.review_rating)

  const step = getProgressStep(order)
  const isApproved = order.status === 'Approved'
  const isCompleted = order.status === 'Completed'

  async function handleAccept() {
    setAccepting(true)
    try {
      const res = await fetch(`${BACKEND}/accept-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.display_id || order.id })
      })
      if (!res.ok) throw new Error('Failed')
      setAccepted(true)
      onOrderUpdate?.()
      // Show review prompt after short delay
      setTimeout(() => setShowReview(true), 800)
    } catch (_) {}
    setAccepting(false)
  }

  async function handleSubmitReview() {
    if (!reviewRating) return
    setReviewSubmitting(true)
    try {
      await fetch(`${BACKEND}/submit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.display_id || order.id,
          rating: reviewRating,
          text: reviewText.trim() || null
        })
      })
    } catch (_) {}
    setReviewDone(true)
    setShowReview(false)
    setReviewSubmitting(false)
  }

  async function handleRevision(e) {
    e.preventDefault()
    if (!revNote.trim()) return
    setRevSubmitting(true)
    setRevError('')
    try {
      const res = await fetch(`${BACKEND}/client-revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, note: revNote.trim() })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Request failed')
      }
      setShowRevForm(false)
      setRevNote('')
      onOrderUpdate?.()
    } catch (err) {
      setRevError(err.message)
    }
    setRevSubmitting(false)
  }

  function handleDownload() {
    if (!order.thumbnail_url) return
    const a = document.createElement('a')
    a.href = order.thumbnail_url
    a.download = `BREVLO_${order.display_id || order.id}.jpg`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Back + Order ID row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={onBack}
          className="nb-btn"
          style={{ fontSize: '12px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '7px' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          BACK
        </button>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          {order.display_id || order.id}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress */}
      <div style={{
        background: '#0A0A0A',
        border: '4px solid rgba(255,255,255,0.08)',
        padding: '32px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }}>
          STEP {step} OF {STEPS.length - 1} — {STEPS[step]?.label}
        </div>
        <ProgressRail step={step} />
        <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{order.title}</div>
        {order.niche && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{order.niche}</div>}
      </div>

      {/* Revision in progress notice */}
      {order.status === 'Revision' && order.revision_note && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: 'rgba(255,107,53,0.06)',
            border: '3px solid rgba(255,107,53,0.25)',
            padding: '18px 24px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '7px' }}>
            REVISION IN PROGRESS
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            {order.revision_note.replace('[QUALITY CONTROL]: ', '').replace('[CLIENT REQUEST]: ', '')}
          </div>
        </motion.div>
      )}

      {/* Thumbnail — ONLY shown when Approved or Completed */}
      {(isApproved || isCompleted) && order.thumbnail_url && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: '#0A0A0A',
            border: '4px solid var(--green)',
            boxShadow: '8px 8px 0 var(--green)',
            padding: '24px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>
            ✓ YOUR THUMBNAIL IS READY
          </div>

          {/* Image wrapper — watermark overlay for pre-accept preview */}
          <div style={{ position: 'relative', display: 'block', lineHeight: 0 }}>
            <img
              src={order.thumbnail_url}
              alt="Your thumbnail"
              style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', border: '2px solid rgba(255,255,255,0.08)', display: 'block' }}
              onContextMenu={e => e.preventDefault()}
              draggable={false}
            />
            {/* Watermark — only before acceptance */}
            {isApproved && !accepted && !isCompleted && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: WATERMARK_BG,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '240px 100px',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  zIndex: 2
                }}
              />
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            {/* Download only unlocked after acceptance */}
            {(isCompleted || accepted) ? (
              <button
                onClick={handleDownload}
                className="nb-btn-yellow"
                style={{ fontSize: '14px', padding: '12px 28px' }}
              >
                DOWNLOAD JPG →
              </button>
            ) : (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.04em' }}>
                🔒 Accept delivery below to unlock full download
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Action buttons — only when Approved (not yet completed) */}
      {isApproved && !accepted && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#0A0A0A',
            border: '4px solid rgba(255,255,255,0.08)',
            padding: '24px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
            TAKE ACTION
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: showRevForm ? '20px' : '0' }}>
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="nb-btn-yellow"
              style={{ fontSize: '14px', padding: '14px 28px', opacity: accepting ? 0.7 : 1 }}
            >
              {accepting ? 'PROCESSING...' : '✓ ACCEPT DELIVERY'}
            </button>
            <button
              onClick={() => { setShowRevForm(v => !v); setRevError('') }}
              className="nb-btn"
              style={{ fontSize: '14px', padding: '14px 28px', background: 'transparent', color: 'var(--orange)', borderColor: 'rgba(255,107,53,0.4)' }}
            >
              {showRevForm ? 'CANCEL' : '↩ REQUEST REVISION'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: showRevForm ? '0' : '12px' }}>
            {order.client_revisions || 0}/2 free revisions used
          </div>

          <AnimatePresence>
            {showRevForm && (
              <motion.form
                onSubmit={handleRevision}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>
                    DESCRIBE WHAT NEEDS CHANGING
                  </label>
                  <textarea
                    value={revNote}
                    onChange={e => setRevNote(e.target.value)}
                    placeholder="Be specific — e.g. 'Make the text bigger, change background to dark red, remove the logo on top right'"
                    rows={4}
                    style={{
                      width: '100%', padding: '14px 16px', fontSize: '14px', lineHeight: 1.6,
                      background: 'rgba(255,255,255,0.04)', color: '#fff',
                      border: '3px solid rgba(255,255,255,0.12)', outline: 'none',
                      resize: 'vertical', fontFamily: 'inherit', marginBottom: '12px'
                    }}
                  />
                  {revError && (
                    <div style={{ fontSize: '13px', color: 'var(--red)', fontWeight: 700, marginBottom: '10px' }}>{revError}</div>
                  )}
                  <button
                    type="submit"
                    disabled={revSubmitting || !revNote.trim()}
                    className="nb-btn"
                    style={{ fontSize: '13px', padding: '12px 24px', opacity: (revSubmitting || !revNote.trim()) ? 0.5 : 1, background: 'var(--orange)', color: '#fff', borderColor: 'var(--orange)' }}
                  >
                    {revSubmitting ? 'SUBMITTING...' : 'SUBMIT REVISION →'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Accepted confirmation */}
      {(accepted || isCompleted) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(0,204,106,0.06)',
            border: '3px solid rgba(0,204,106,0.25)',
            padding: '20px 24px',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '20px', fontFamily: 'var(--font-rocket)', color: 'var(--green)', marginBottom: '6px' }}>DELIVERY ACCEPTED ✓</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Order complete. Thank you for choosing Brevlo.</div>
        </motion.div>
      )}

      {/* Review prompt — shown after acceptance, dismissable */}
      <AnimatePresence>
        {showReview && !reviewDone && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{
              background: '#0A0A0A',
              border: '4px solid var(--yellow)',
              boxShadow: '8px 8px 0 var(--yellow)',
              padding: '32px 28px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontFamily: 'var(--font-rocket)', color: '#fff', lineHeight: 1.1 }}>
                HOW'D WE DO?
              </div>
              <button
                onClick={() => setShowReview(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '18px', padding: '0 0 0 12px', lineHeight: 1 }}
                title="Skip review"
              >✕</button>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '24px' }}>
              Your feedback helps us get better — takes 10 seconds.
            </div>

            {/* Stars */}
            <div style={{ marginBottom: '24px' }}>
              <StarRating rating={reviewRating} onRate={setReviewRating} />
              {reviewRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--yellow)', marginTop: '10px' }}
                >
                  {['','TERRIBLE','POOR','OKAY','GOOD','EXCELLENT!'][reviewRating]}
                </motion.div>
              )}
            </div>

            {/* Optional text */}
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Anything else you'd like to share? (optional)"
              rows={3}
              style={{
                width: '100%', padding: '14px 16px', fontSize: '14px', lineHeight: 1.6,
                background: 'rgba(255,255,255,0.04)', color: '#fff',
                border: '3px solid rgba(255,255,255,0.12)', outline: 'none',
                resize: 'none', fontFamily: 'inherit', marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleSubmitReview}
                disabled={!reviewRating || reviewSubmitting}
                className="nb-btn-yellow"
                style={{ fontSize: '13px', padding: '12px 28px', opacity: (!reviewRating || reviewSubmitting) ? 0.45 : 1 }}
              >
                {reviewSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW →'}
              </button>
              <button
                onClick={() => setShowReview(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0' }}
              >
                No thanks
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review thank-you */}
      <AnimatePresence>
        {reviewDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(255,230,0,0.04)',
              border: '3px solid rgba(255,230,0,0.2)',
              padding: '18px 24px',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <div style={{ fontSize: '20px' }}>★</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--yellow)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Review Submitted</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Thanks for the feedback. See you on the next one.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TrackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlId = searchParams.get('id') || ''

  const [inputId, setInputId] = useState(urlId)
  const [lookupId, setLookupId] = useState(urlId)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(!!urlId)
  const [notFound, setNotFound] = useState(false)
  const [view, setView] = useState('search') // 'search' | 'card' | 'tracking'
  const intervalRef = useRef(null)

  async function fetchOrder(id, silent = false) {
    if (!id) return
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/get-order/${encodeURIComponent(id)}`)
      if (!res.ok) {
        if (!silent) { setNotFound(true); setOrder(null); setView('search') }
        return
      }
      const data = await res.json()
      setOrder(data)
      setNotFound(false)
      if (!silent) setView('card')
    } catch (_) {}
    if (!silent) setLoading(false)
  }

  useEffect(() => {
    if (!lookupId) return
    fetchOrder(lookupId)
  }, [lookupId])

  // Poll every 5s only when in tracking view
  useEffect(() => {
    if (view !== 'tracking' || !lookupId) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => fetchOrder(lookupId, true), POLL_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [view, lookupId])

  function handleLookup(e) {
    e?.preventDefault()
    const id = inputId.trim().toUpperCase()
    if (!id) return
    setLookupId(id)
    router.push('/track?id=' + id, { shallow: true })
    setNotFound(false)
    setOrder(null)
    setView('search')
  }

  return (
    <main style={{ minHeight: '100vh', padding: '80px 24px 120px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: '32px' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          BREVLO HOME
        </a>
        <div className="label-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto 16px' }}>ORDER TRACKER</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-rocket)', lineHeight: 1.05, color: '#fff', marginBottom: '12px' }}>
          REAL-TIME <span style={{ color: 'var(--yellow)' }}>STATUS.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', maxWidth: '380px', margin: '0 auto' }}>
          Enter your Order ID to see exactly where your thumbnail is.
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Search form — always visible unless in 'tracking' view */}
        <AnimatePresence>
          {view !== 'tracking' && (
            <motion.form
              onSubmit={handleLookup}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}
            >
              <input
                type="text"
                value={inputId}
                onChange={e => setInputId(e.target.value.toUpperCase())}
                placeholder="BREVLO-XXXXXX"
                style={{
                  flex: 1, padding: '16px 20px', fontSize: '18px',
                  fontFamily: 'var(--font-rocket)', letterSpacing: '0.06em',
                  background: 'rgba(255,255,255,0.04)', color: '#fff',
                  border: '4px solid rgba(255,255,255,0.18)', outline: 'none'
                }}
              />
              <button type="submit" className="nb-btn-yellow" style={{ padding: '16px 28px', fontSize: '15px', flexShrink: 0 }}>
                TRACK →
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              style={{ width: '36px', height: '36px', border: '4px solid rgba(255,230,0,0.15)', borderTopColor: 'var(--yellow)', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
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
              textAlign: 'center', padding: '40px 32px',
              border: '4px solid rgba(239,68,68,0.25)',
              background: 'rgba(239,68,68,0.04)'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: '12px' }}>ORDER NOT FOUND</div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              Check your Order ID — it looks like BREVLO-XXXXXX
            </p>
            <button onClick={() => router.push('/order')} className="nb-btn-yellow" style={{ fontSize: '13px', padding: '11px 24px' }}>
              PLACE A NEW ORDER →
            </button>
          </motion.div>
        )}

        {/* Step 1 — Order card */}
        <AnimatePresence mode="wait">
          {order && view === 'card' && !loading && (
            <OrderCard
              key="card"
              order={order}
              onExpand={() => setView('tracking')}
            />
          )}

          {/* Step 2 — Live tracking panel */}
          {order && view === 'tracking' && !loading && (
            <TrackingPanel
              key="tracking"
              order={order}
              onBack={() => setView('card')}
              onOrderUpdate={() => fetchOrder(lookupId, true)}
            />
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-rocket)', fontSize: '2rem', color: 'rgba(255,255,255,0.3)' }}>LOADING...</div>
      </div>
    }>
      <TrackContent />
    </Suspense>
  )
}
