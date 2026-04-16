'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://brevlo-backend.onrender.com'

const NICHES = ['Gaming', 'Finance', 'History', 'Vlogs', 'Tech', 'Fitness', 'Education', 'Entertainment', 'Other']

const INCLUDES = [
  ['1 × Premium Thumbnail', 'Human-made in Photoshop'],
  ['JPG + Web-Ready Export', 'High-res, optimised for YouTube'],
  ['Same-day delivery', 'Within 24 hours guaranteed'],
  ['2 Free revisions', 'Any changes needed'],
  ['CTR-optimised design', 'Proven viral patterns'],
]

export default function RequirementsPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', title: '', niche: '', brandingNotes: '' })
  const [refs, setRefs] = useState([''])
  const [uploadedImages, setUploadedImages] = useState([]) // { name, url, preview }
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [transitioning, setTransitioning] = useState(false)
  const fileInputRef = useRef(null)

  // Persist draft
  useEffect(() => {
    const saved = sessionStorage.getItem('brevlo_req_draft')
    if (saved) {
      try {
        const { form: f, refs: r } = JSON.parse(saved)
        if (f) setForm(f)
        if (r) setRefs(r)
      } catch (_) {}
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('brevlo_req_draft', JSON.stringify({ form, refs }))
  }, [form, refs])

  function updateForm(key, val) {
    setForm(p => ({ ...p, [key]: val }))
    if (formErrors[key]) setFormErrors(p => ({ ...p, [key]: '' }))
  }

  function addRef() { if (refs.length < 5) setRefs(p => [...p, '']) }
  function updateRef(i, val) { setRefs(p => p.map((r, idx) => idx === i ? val : r)) }
  function removeRef(i) { setRefs(p => p.filter((_, idx) => idx !== i)) }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (uploadedImages.length + files.length > 5) {
      setError('Max 5 reference images allowed')
      return
    }
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('images', f))
      const res = await fetch(`${BACKEND}/upload-references`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      const previews = await Promise.all(files.map(f => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = ev => resolve(ev.target.result)
        reader.readAsDataURL(f)
      })))
      setUploadedImages(prev => [
        ...prev,
        ...data.urls.map((url, i) => ({ name: files[i].name, url, preview: previews[i] }))
      ])
    } catch (err) {
      setError('Image upload failed. Try again.')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(i) {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== i))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.niche) errs.niche = 'Pick a niche'
    return errs
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setSubmitting(true)
    setError('')

    try {
      const cleanRefs = refs.filter(r => r.trim())
      const imageUrls = uploadedImages.map(i => i.url)

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
          reference_images: imageUrls.length ? imageUrls : null,
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
      sessionStorage.removeItem('brevlo_req_draft')

      // Transition out
      setTransitioning(true)
      setTimeout(() => router.push('/success?id=' + (data.displayId || data.orderId)), 500)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Exit transition overlay */}
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
        <a href="/order" className="nb-btn" style={{
          fontSize: '12px', padding: '9px 16px',
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          textDecoration: 'none', color: '#fff', background: 'transparent',
          border: '3px solid rgba(255,255,255,0.2)'
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          BACK TO CRAFT
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.12)' }}/>
          <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            REQUIREMENTS LAB
          </div>
        </div>
      </div>

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{ textAlign: 'center', padding: '60px 24px 48px' }}
      >
        <div className="label-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto 16px' }}>PHASE 2 OF 2</div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-rocket)',
          lineHeight: 1.0, color: '#fff', marginBottom: '14px'
        }}>
          BRIEF US. <span style={{ color: 'var(--yellow)' }}>WE'LL DO THE REST.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto' }}>
          The more we know, the better the thumbnail. Fill this out completely.
        </p>
      </motion.div>

      {/* Main content */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'start' }}>

          {/* ── LEFT: FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                {/* Name + Email */}
                <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px' }}>
                  <div style={sectionLabel}>YOUR DETAILS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Full Name <span style={{ color: 'var(--yellow)' }}>*</span></label>
                      <input
                        type="text" value={form.name}
                        onChange={e => updateForm('name', e.target.value)}
                        placeholder="John Creator"
                        style={{ ...inputStyle, borderColor: formErrors.name ? 'var(--red)' : '' }}
                      />
                      {formErrors.name && <div style={errStyle}>{formErrors.name}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Email <span style={{ color: 'var(--yellow)' }}>*</span></label>
                      <input
                        type="email" value={form.email}
                        onChange={e => updateForm('email', e.target.value)}
                        placeholder="you@email.com"
                        style={{ ...inputStyle, borderColor: formErrors.email ? 'var(--red)' : '' }}
                      />
                      {formErrors.email && <div style={errStyle}>{formErrors.email}</div>}
                    </div>
                  </div>
                </div>

                {/* Video Title */}
                <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px' }}>
                  <div style={sectionLabel}>YOUR VIDEO</div>
                  <label style={labelStyle}>Video Title / Concept <span style={{ color: 'var(--yellow)' }}>*</span></label>
                  <input
                    type="text" value={form.title}
                    onChange={e => updateForm('title', e.target.value)}
                    placeholder="e.g. I Built a City in 100 Days"
                    style={{ ...inputStyle, borderColor: formErrors.title ? 'var(--red)' : '' }}
                  />
                  {formErrors.title && <div style={errStyle}>{formErrors.title}</div>}
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                    This is the most important field. Be as specific as possible.
                  </div>
                </div>

                {/* Niche */}
                <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px' }}>
                  <div style={sectionLabel}>CONTENT NICHE</div>
                  <label style={labelStyle}>Pick your niche <span style={{ color: 'var(--yellow)' }}>*</span></label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {NICHES.map(n => (
                      <button
                        key={n} type="button"
                        onClick={() => { updateForm('niche', n); setFormErrors(p => ({ ...p, niche: '' })) }}
                        style={{
                          padding: '10px 20px', fontSize: '13px', fontWeight: 800,
                          letterSpacing: '0.04em', textTransform: 'uppercase',
                          border: `3px solid ${form.niche === n ? 'var(--yellow)' : 'rgba(255,255,255,0.15)'}`,
                          background: form.niche === n ? 'var(--yellow)' : 'transparent',
                          color: form.niche === n ? 'var(--black)' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer', transition: 'all 0.1s'
                        }}
                      >{n}</button>
                    ))}
                  </div>
                  {formErrors.niche && <div style={{ ...errStyle, marginTop: '10px' }}>{formErrors.niche}</div>}
                </div>

                {/* References */}
                <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px' }}>
                  <div style={sectionLabel}>REFERENCES</div>

                  {/* URL references */}
                  <label style={labelStyle}>Reference URLs <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>(up to 5)</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {refs.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="url" value={r}
                          onChange={e => updateRef(i, e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {refs.length > 1 && (
                          <button
                            type="button" onClick={() => removeRef(i)}
                            style={{
                              width: '44px', height: '44px', flexShrink: 0,
                              background: 'rgba(239,68,68,0.08)', border: '3px solid rgba(239,68,68,0.25)',
                              color: 'var(--red)', cursor: 'pointer', fontSize: '18px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >×</button>
                        )}
                      </div>
                    ))}
                    {refs.length < 5 && (
                      <button type="button" onClick={addRef} style={{
                        alignSelf: 'flex-start', fontSize: '11px', fontWeight: 800,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)', background: 'transparent',
                        border: '2px dashed rgba(255,255,255,0.12)', padding: '8px 14px', cursor: 'pointer'
                      }}>+ ADD URL</button>
                    )}
                  </div>

                  {/* Image upload */}
                  <label style={labelStyle}>Reference Images <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>(up to 5 images)</span></label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || uploadedImages.length >= 5}
                    style={{
                      width: '100%', padding: '16px', marginBottom: '14px',
                      background: 'rgba(255,255,255,0.03)', border: '3px dashed rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.5)', cursor: (uploading || uploadedImages.length >= 5) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                      opacity: uploadedImages.length >= 5 ? 0.5 : 1
                    }}
                  >
                    {uploading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%' }}
                        />
                        UPLOADING...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        UPLOAD REFERENCE IMAGES
                      </>
                    )}
                  </button>

                  {/* Uploaded images preview */}
                  {uploadedImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {uploadedImages.map((img, i) => (
                        <div key={i} style={{ position: 'relative', width: '80px', height: '60px' }}>
                          <img src={img.preview} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)' }} />
                          <button
                            type="button" onClick={() => removeImage(i)}
                            style={{
                              position: 'absolute', top: '-6px', right: '-6px',
                              width: '18px', height: '18px', borderRadius: '50%',
                              background: '#ef4444', border: 'none', color: '#fff',
                              fontSize: '11px', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', fontWeight: 700
                            }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '10px' }}>
                    URLs to thumbnails you like, plus any reference images you want to share.
                  </div>
                </div>

                {/* Branding Notes */}
                <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px' }}>
                  <div style={sectionLabel}>BRANDING & NOTES</div>
                  <label style={labelStyle}>Extra Instructions <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>(Optional)</span></label>
                  <textarea
                    value={form.brandingNotes}
                    onChange={e => updateForm('brandingNotes', e.target.value)}
                    placeholder="Brand colors, font preferences, tone (bold/clean/dark), text to include, face reveal or no, specific style..."
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                  />
                </div>

              </div>
            </form>
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
              {/* Summary header */}
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

              {/* Price */}
              <div style={{ padding: '20px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>Total</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '42px', fontFamily: 'var(--font-rocket)', color: '#fff', lineHeight: 1 }}>$20</span>
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

              {/* PSD upsell note */}
              <div style={{ padding: '14px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                  Want the <strong style={{ color: 'rgba(255,255,255,0.5)' }}>PSD source file</strong>? Add it for +$15 — mention it in your branding notes.
                </div>
              </div>

              {/* Test mode */}
              <div style={{ padding: '14px 28px', borderBottom: '3px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', marginTop: '3px', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)' }}>DUMMY PAYMENT MODE</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px', lineHeight: 1.5 }}>No real charge. Order is real — assigned to a designer.</div>
                  </div>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '2px solid rgba(239,68,68,0.25)', padding: '12px 28px', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div style={{ padding: '20px 28px' }}>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="nb-btn-yellow"
                  style={{ width: '100%', fontSize: '16px', padding: '18px 24px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  whileHover={!submitting ? { x: 3, y: 3, boxShadow: '4px 4px 0 var(--black)' } : {}}
                  whileTap={!submitting ? { x: 6, y: 6, boxShadow: '0px 0px 0 var(--black)' } : {}}
                >
                  {submitting ? 'PROCESSING...' : 'COMPLETE ORDER →'}
                </motion.button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Secured · No real charge
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 900px) {
          .req-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

/* ── Micro styles ── */
const sectionLabel = {
  fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.25)', marginBottom: '18px',
  paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)'
}

const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '10px'
}

const inputStyle = {
  width: '100%', padding: '13px 16px', fontSize: '15px',
  background: 'rgba(255,255,255,0.04)', color: '#fff',
  border: '3px solid rgba(255,255,255,0.12)', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s'
}

const errStyle = {
  fontSize: '11px', color: 'var(--red)', fontWeight: 700, marginTop: '5px', letterSpacing: '0.04em'
}
