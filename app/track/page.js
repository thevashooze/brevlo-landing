'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'
const POLL_INTERVAL = 5000

const WATERMARK_BG = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100"><text x="120" y="50" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="13" font-weight="900" letter-spacing="5" fill="rgba(255,255,255,0.13)" transform="rotate(-30,120,50)">BREVLO PREVIEW</text></svg>')}")`

const STEPS = [
  { label: 'Received',      sub: 'Brief in system' },
  { label: 'Strategy',      sub: 'Analysing patterns' },
  { label: 'Designing',     sub: 'In Photoshop' },
  { label: 'Quality Check', sub: 'Internal review' },
  { label: 'Delivered',     sub: 'Ready to download' },
  { label: 'Completed',     sub: 'Delivery accepted' }
]

function getProgressStep(order) {
  if (!order) return 0
  const s = order.status
  const ds = order.designer_stage || 'Strategy'
  if (s === 'Completed') return 5
  if (s === 'Approved') return 4
  if (s === 'Done') return 3
  if (s === 'Assigned' || s === 'Revision') {
    if (ds === 'QC') return 3
    if (ds === 'Designing') return 2
    return 1
  }
  return 0
}

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

function ProgressRail({ step, isRevision }) {
  const total = STEPS.length - 1
  const isDelivered = step >= 4
  const barColor = isRevision ? '#FF6B35' : isDelivered ? '#00CC6A' : '#FFE600'

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          const isRevisionSlot = isRevision && i === 2
          const dotColor = done ? '#00CC6A' : active ? barColor : 'rgba(255,255,255,0.12)'
          const dotSize = active ? 12 : 8

          let rectBg, rectBorder, rectText, rectLabel
          if (isRevisionSlot) {
            rectBg = 'rgba(255,107,53,0.15)'; rectBorder = 'rgba(255,107,53,0.5)'; rectText = '#FF6B35'; rectLabel = 'REVISION'
          } else if (done) {
            rectBg = 'rgba(0,204,106,0.1)'; rectBorder = 'rgba(0,204,106,0.3)'; rectText = '#00CC6A'; rectLabel = s.label
          } else if (active) {
            rectBg = `rgba(${isDelivered ? '0,204,106' : isRevision ? '255,107,53' : '255,230,0'},0.12)`
            rectBorder = `rgba(${isDelivered ? '0,204,106' : isRevision ? '255,107,53' : '255,230,0'},0.4)`
            rectText = barColor; rectLabel = s.label
          } else {
            rectBg = 'rgba(255,255,255,0.03)'; rectBorder = 'rgba(255,255,255,0.08)'; rectText = 'rgba(255,255,255,0.2)'; rectLabel = s.label
          }

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {i > 0 && (
                <div style={{
                  position: 'absolute', top: `${dotSize / 2 - 1.5}px`, right: '50%', left: 0,
                  height: '3px', background: done || active ? barColor : 'rgba(255,255,255,0.07)',
                  transition: 'background 0.4s'
                }} />
              )}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', top: `${dotSize / 2 - 1.5}px`, left: '50%', right: 0,
                  height: '3px', background: done ? barColor : 'rgba(255,255,255,0.07)',
                  transition: 'background 0.4s'
                }} />
              )}
              <div style={{
                width: `${dotSize}px`, height: `${dotSize}px`,
                borderRadius: '50%', background: dotColor,
                border: active ? `2px solid ${dotColor}` : 'none',
                zIndex: 2, marginBottom: '10px', flexShrink: 0,
                transition: 'all 0.4s'
              }} />
              <div style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                color: rectText, background: rectBg, border: `1px solid ${rectBorder}`,
                borderRadius: '4px', padding: '3px 6px', lineHeight: 1.3,
                width: 'fit-content', maxWidth: '100%', margin: '0 auto', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {rectLabel}
              </div>
              {active && (
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', marginTop: '3px', textAlign: 'center' }}>
                  {s.sub}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getStatusShadow(status) {
  if (status === 'Approved' || status === 'Completed') return '#00CC6A'
  if (status === 'Revision') return '#FF6B35'
  if (status === 'Done') return '#3b82f6'
  return '#FFE600'
}

function OrderCard({ order, onExpand }) {
  const shadowColor = getStatusShadow(order.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      onClick={onExpand}
      style={{
        background: '#0A0A0A',
        border: '4px solid rgba(255,255,255,0.18)',
        boxShadow: `8px 8px 0 ${shadowColor}`,
        padding: '28px 32px',
        cursor: 'pointer'
      }}
      whileHover={{ x: 4, y: 4, boxShadow: `4px 4px 0 ${shadowColor}` }}
      whileTap={{ x: 8, y: 8, boxShadow: `0px 0px 0 ${shadowColor}` }}
      transition={{ type: 'tween', duration: 0.08 }}
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
  const [showLightbox, setShowLightbox] = useState(false)

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
        <ProgressRail step={step} isRevision={order.status === 'Revision'} />
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
            border: '3px solid #fff',
            boxShadow: '0 6px 0 var(--green)',
            padding: '24px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>
            ✓ YOUR THUMBNAIL IS READY
          </div>

          <div
            style={{ position: 'relative', display: 'block', lineHeight: 0, borderRadius: '8px', overflow: 'hidden', cursor: (accepted || isCompleted) ? 'zoom-in' : 'default' }}
            onClick={() => { if (accepted || isCompleted) setShowLightbox(true) }}
          >
            <img
              src={order.thumbnail_url}
              alt="Your thumbnail"
              style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block' }}
              onContextMenu={e => e.preventDefault()}
              draggable={false}
            />
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
        </motion.div>
      )}

      {/* Action section */}
      {isApproved && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#0A0A0A',
            border: '4px solid rgba(255,255,255,0.08)',
            padding: '16px 20px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textAlign: 'center' }}>
            TAKE ACTION
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(accepted || isCompleted) ? (
              <button
                onClick={handleDownload}
                className="nb-btn-yellow action-btn"
                style={{ fontSize: '14px', padding: '14px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v12M8 14l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                DOWNLOAD JPG
              </button>
            ) : (
              <>
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="nb-btn-yellow action-btn"
                  style={{ fontSize: '14px', padding: '14px 28px', opacity: accepting ? 0.7 : 1 }}
                >
                  {accepting ? 'PROCESSING...' : '✓ ACCEPT DELIVERY'}
                </button>
                <button
                  onClick={() => { setShowRevForm(v => !v); setRevError('') }}
                  className="nb-btn action-btn"
                  style={{ fontSize: '14px', padding: '14px 28px', background: 'transparent', color: 'var(--orange)', borderColor: 'rgba(255,107,53,0.4)' }}
                >
                  {showRevForm ? 'CANCEL' : '↩ REQUEST REVISION'}
                </button>
              </>
            )}
          </div>

          <AnimatePresence>
            {showRevForm && (
              <motion.form
                onSubmit={handleRevision}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'visible' }}
              >
                <div style={{ paddingTop: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    {order.client_revisions || 0}/2 free revisions used
                  </div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>
                    DESCRIBE WHAT NEEDS CHANGING
                  </label>
                  <textarea
                    value={revNote}
                    onChange={e => setRevNote(e.target.value)}
                    placeholder="Be specific — e.g. 'Make the text bigger, change background to dark red'"
                    rows={4}
                    style={{
                      width: '100%', padding: '14px 16px', fontSize: '14px', lineHeight: 1.6,
                      background: 'rgba(255,255,255,0.04)', color: '#fff',
                      border: '3px solid rgba(255,255,255,0.12)', outline: 'none',
                      resize: 'vertical', fontFamily: 'inherit', marginBottom: '12px', boxSizing: 'border-box'
                    }}
                  />
                  {revError && <div style={{ fontSize: '13px', color: 'var(--red)', fontWeight: 700, marginBottom: '10px' }}>{revError}</div>}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={revSubmitting || !revNote.trim()}
                      className="nb-btn action-btn"
                      style={{ fontSize: '13px', padding: '12px 24px', opacity: (revSubmitting || !revNote.trim()) ? 0.5 : 1, background: 'var(--orange)', color: '#fff', borderColor: 'var(--orange)' }}
                    >
                      {revSubmitting ? 'SUBMITTING...' : 'SUBMIT REVISION →'}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}

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

      {/* Review overlay */}
      <AnimatePresence>
        {showReview && !reviewDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 8000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={() => setShowReview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: '#0A0A0A', border: '4px solid var(--yellow)',
                boxShadow: '8px 8px 0 var(--yellow)',
                padding: '32px 28px', maxWidth: '480px', width: '100%', borderRadius: '8px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontFamily: 'var(--font-rocket)', color: '#fff', lineHeight: 1.1 }}>
                  HOW'D WE DO?
                </div>
                <button onClick={() => setShowReview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '18px', padding: '0 0 0 12px', lineHeight: 1 }}>✕</button>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '24px' }}>
                Your feedback helps us get better. Takes 10 seconds.
              </div>
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
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Anything else? (optional)"
                rows={3}
                style={{
                  width: '100%', padding: '14px 16px', fontSize: '14px', lineHeight: 1.6,
                  background: 'rgba(255,255,255,0.04)', color: '#fff',
                  border: '3px solid rgba(255,255,255,0.12)', outline: 'none',
                  resize: 'none', fontFamily: 'inherit', marginBottom: '16px', boxSizing: 'border-box'
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
                <button onClick={() => setShowReview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  No thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowLightbox(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={order.thumbnail_url}
              alt="Thumbnail preview"
              onClick={e => e.stopPropagation()}
              onContextMenu={e => e.preventDefault()}
              draggable={false}
              style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', border: '3px solid #fff' }}
            />
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
  const [view, setView] = useState('search')
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
      <a href="/" className="nb-btn-yellow" style={{
        position: 'fixed', top: '16px', left: '24px', zIndex: 101,
        fontSize: '12px', padding: '8px 20px',
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        textDecoration: 'none'
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        BREVLO HOME
      </a>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div className="label-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto 16px' }}>ORDER TRACKER</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-rocket)', lineHeight: 1.05, color: '#fff', marginBottom: '12px' }}>
          REAL-TIME <span style={{ color: 'var(--yellow)' }}>STATUS.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', maxWidth: '380px', margin: '0 auto' }}>
          Enter your Order ID to see exactly where your thumbnail is.
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

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

        <AnimatePresence mode="wait">
          {order && view === 'card' && !loading && (
            <OrderCard
              key="card"
              order={order}
              onExpand={() => setView('tracking')}
            />
          )}

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

      <style>{`
        .action-btn {
          transition: transform 0.1s ease, box-shadow 0.1s ease !important;
        }
        .action-btn:hover:not(:disabled) {
          transform: translateY(2px) !important;
          box-shadow: 4px 4px 0 var(--black) !important;
        }
        .action-btn:active:not(:disabled) {
          transform: translateY(4px) !important;
          box-shadow: 2px 2px 0 var(--black) !important;
        }
      `}</style>
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
