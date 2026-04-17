'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const NICHES = ['Gaming', 'Finance', 'History', 'Vlogs', 'Tech', 'Fitness', 'Education', 'Entertainment', 'Other']

export default function RequirementsPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', title: '', niche: '', brief: '', channel: '' })
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [uploadError, setUploadError] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('brevlo_req_draft')
    if (saved) {
      try {
        const { form: f } = JSON.parse(saved)
        if (f) setForm(prev => ({ ...prev, ...f }))
      } catch (_) {}
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('brevlo_req_draft', JSON.stringify({ form }))
  }, [form])

  function updateForm(key, val) {
    setForm(p => ({ ...p, [key]: val }))
    if (formErrors[key]) setFormErrors(p => ({ ...p, [key]: '' }))
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (uploadedImages.length + files.length > 5) {
      setUploadError('Max 5 images allowed')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('images', f))
      const res = await fetch('https://brevlo-backend.onrender.com/upload-references', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const previews = await Promise.all(files.map(f => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = ev => resolve(ev.target.result)
        reader.readAsDataURL(f)
      })))
      setUploadedImages(prev => [...prev, ...data.urls.map((url, i) => ({ name: files[i].name, url, preview: previews[i] }))])
    } catch {
      setUploadError('Upload failed. Try again.')
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
    if (!form.brief.trim()) errs.brief = 'Required'
    return errs
  }

  function handleContinue(e) {
    e?.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setFormErrors(errs)
      const firstErr = document.querySelector('[data-err]')
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    sessionStorage.setItem('brevlo_order_data', JSON.stringify({ form, uploadedImages }))
    setTransitioning(true)
    setTimeout(() => router.push('/payment'), 520)
  }

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

      {/* Top bar — just back + step indicator, no dark bg */}
      <div style={{
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <a href="/order" className="nb-btn-yellow" style={{
          fontSize: '12px', padding: '10px 18px',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none'
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          BACK
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '22px', height: '22px', background: 'var(--yellow)', border: '2px solid var(--black)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 900, color: 'var(--black)'
            }}>1</div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--yellow)' }}>BRIEF</span>
          </div>
          <div style={{ width: '28px', height: '2px', background: 'rgba(255,255,255,0.2)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '22px', height: '22px', background: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.3)'
            }}>2</div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>PAYMENT</span>
          </div>
        </div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ textAlign: 'center', padding: '32px 24px 44px' }}
      >
        <div className="label-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto 20px' }}>
          STEP 01 / 02 — BRIEF
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
          fontFamily: 'var(--font-rocket)',
          lineHeight: 1.0, color: '#fff', marginBottom: '14px'
        }}>
          TELL US ABOUT THE VIDEO.
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', margin: '0 auto' }}>
          The more we know, the better we design. Takes about 2 minutes.
        </p>
      </motion.div>

      {/* Form — single white card */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
        <motion.form
          onSubmit={handleContinue}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* White card */}
          <div style={{
            background: '#fff',
            border: '4px solid #0A0A0A',
            boxShadow: '14px 14px 0 #0A0A0A',
            padding: '40px',
            color: '#0A0A0A'
          }}>

            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div data-err={formErrors.name ? 'true' : undefined}>
                <label style={lbl}>YOUR NAME <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  type="text" value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  placeholder="John Creator"
                  style={{ ...inp, borderColor: formErrors.name ? 'var(--red)' : '#0A0A0A' }}
                />
                {formErrors.name && <div style={err}>{formErrors.name}</div>}
              </div>
              <div data-err={formErrors.email ? 'true' : undefined}>
                <label style={lbl}>YOUR EMAIL <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  type="email" value={form.email}
                  onChange={e => updateForm('email', e.target.value)}
                  placeholder="you@email.com"
                  style={{ ...inp, borderColor: formErrors.email ? 'var(--red)' : '#0A0A0A' }}
                />
                {formErrors.email && <div style={err}>{formErrors.email}</div>}
              </div>
            </div>

            {/* Divider */}
            <div style={divider} />

            {/* Video Title */}
            <div style={{ marginBottom: '28px' }} data-err={formErrors.title ? 'true' : undefined}>
              <label style={lbl}>VIDEO TITLE / CONCEPT <span style={{ color: 'var(--red)' }}>*</span></label>
              <input
                type="text" value={form.title}
                onChange={e => updateForm('title', e.target.value)}
                placeholder="e.g. I Tried Apple Vision Pro For 30 Days"
                style={{ ...inp, borderColor: formErrors.title ? 'var(--red)' : '#0A0A0A' }}
              />
              {formErrors.title && <div style={err}>{formErrors.title}</div>}
            </div>

            {/* Divider */}
            <div style={divider} />

            {/* Niche */}
            <div style={{ marginBottom: '28px' }} data-err={formErrors.niche ? 'true' : undefined}>
              <label style={lbl}>NICHE <span style={{ color: 'var(--red)' }}>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {NICHES.map(n => {
                  const active = form.niche === n
                  return (
                    <button
                      key={n} type="button"
                      onClick={() => { updateForm('niche', n) }}
                      style={{
                        padding: '13px 8px',
                        fontSize: '12px', fontWeight: 900,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        border: `3px solid #0A0A0A`,
                        background: active ? 'var(--yellow)' : '#fff',
                        color: '#0A0A0A',
                        boxShadow: active ? '4px 4px 0 #0A0A0A' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                        fontFamily: 'var(--font-body)'
                      }}
                    >{n}</button>
                  )
                })}
              </div>
              {formErrors.niche && <div style={{ ...err, marginTop: '10px' }}>{formErrors.niche}</div>}
            </div>

            {/* Divider */}
            <div style={divider} />

            {/* The Brief */}
            <div style={{ marginBottom: '28px' }} data-err={formErrors.brief ? 'true' : undefined}>
              <label style={lbl}>THE BRIEF <span style={{ color: 'var(--red)' }}>*</span></label>
              <textarea
                value={form.brief}
                onChange={e => updateForm('brief', e.target.value)}
                placeholder="What's the hook? Who's the audience? Any must-have text, expressions, colors? (3–4 sentences is plenty)"
                rows={5}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.65, borderColor: formErrors.brief ? 'var(--red)' : '#0A0A0A' }}
              />
              {formErrors.brief && <div style={err}>{formErrors.brief}</div>}
            </div>

            {/* Divider */}
            <div style={divider} />

            {/* Reference images */}
            <div style={{ marginBottom: '28px' }}>
              <label style={lbl}>IMAGES TO USE / REFERENCES <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>(OPTIONAL)</span></label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || uploadedImages.length >= 5}
                style={{
                  width: '100%', padding: '32px 20px',
                  background: 'rgba(0,0,0,0.02)',
                  border: '3px dashed rgba(0,0,0,0.2)',
                  color: 'rgba(0,0,0,0.4)',
                  cursor: (uploading || uploadedImages.length >= 5) ? 'not-allowed' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  opacity: uploadedImages.length >= 5 ? 0.5 : 1,
                  transition: 'border-color 0.15s',
                  marginBottom: uploadedImages.length > 0 ? '14px' : 0
                }}
              >
                {uploading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#0A0A0A', borderRadius: '50%' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>UPLOADING...</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '28px', lineHeight: 1, color: 'rgba(0,0,0,0.35)' }}>↑</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      DROP REFERENCE IMAGES · PNG / JPG · UP TO 5
                    </span>
                  </>
                )}
              </button>

              {uploadError && <div style={{ ...err, marginBottom: '10px' }}>{uploadError}</div>}

              {uploadedImages.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {uploadedImages.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: '72px', height: '54px' }}>
                      <img src={img.preview} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid #0A0A0A' }} />
                      <button
                        type="button" onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: '-6px', right: '-6px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: '#ef4444', border: 'none', color: '#fff',
                          fontSize: '11px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                        }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={divider} />

            {/* Channel URL */}
            <div>
              <label style={lbl}>YOUR CHANNEL <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>(OPTIONAL)</span></label>
              <input
                type="url" value={form.channel}
                onChange={e => updateForm('channel', e.target.value)}
                placeholder="youtube.com/@yourhandle"
                style={inp}
              />
            </div>

          </div>

          {/* Bottom action bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 0', flexWrap: 'wrap', gap: '16px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
              STEP 1 OF 2 · NEXT: PAYMENT
            </div>
            <motion.button
              type="submit"
              className="nb-btn-yellow"
              style={{ fontSize: '15px', padding: '18px 36px' }}
              whileHover={{ x: 3, y: 3, boxShadow: '4px 4px 0 var(--black)' }}
              whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0 var(--black)' }}
            >
              CONTINUE TO PAYMENT →
            </motion.button>
          </div>

        </motion.form>
      </div>

      <style>{`
        input:focus, textarea:focus {
          outline: none !important;
          border-color: var(--yellow) !important;
          box-shadow: 4px 4px 0 var(--yellow) !important;
        }
        @media (max-width: 600px) {
          .name-email-grid { grid-template-columns: 1fr !important; }
          .niche-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}

/* ── Styles ── */
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 800,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.5)', marginBottom: '10px'
}

const inp = {
  width: '100%', padding: '13px 16px', fontSize: '15px',
  background: '#fff', color: '#0A0A0A',
  border: '3px solid #0A0A0A', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
  display: 'block'
}

const err = {
  fontSize: '11px', color: 'var(--red)', fontWeight: 700,
  marginTop: '6px', letterSpacing: '0.04em'
}

const divider = {
  height: '1px', background: 'rgba(0,0,0,0.08)',
  margin: '0 0 28px 0'
}
