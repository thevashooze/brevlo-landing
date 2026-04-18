'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const NICHES = ['Gaming', 'Finance', 'Entertainment', 'Vlogs', 'Tech', 'Fitness', 'Education', 'Other']

export default function RequirementsPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', title: '', niche: '', brief: '', channel: '' })
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [transitioning, setTransitioning] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('brevlo_req_draft')
    if (saved) {
      try {
        const { form: f } = JSON.parse(saved)
        if (f) setForm(prev => ({ ...prev, ...f, niche: '' })) // niche never auto-restored
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
    if (uploadedImages.length + files.length > 10) {
      setUploadError('Max 10 images allowed')
      return
    }
    setUploadError('')

    // Show instant previews
    const previews = await Promise.all(files.map(f => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = ev => resolve({ name: f.name, preview: ev.target.result, url: null, uploading: true })
      reader.readAsDataURL(f)
    })))

    const startIndex = uploadedImages.length
    setUploadedImages(prev => [...prev, ...previews])

    // Background upload
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('images', f))
      const res = await fetch('https://brevlo-backend.onrender.com/upload-references', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUploadedImages(prev => prev.map((img, i) => {
        if (i >= startIndex && i < startIndex + files.length) {
          return { ...img, url: data.urls[i - startIndex], uploading: false }
        }
        return img
      }))
    } catch {
      setUploadError('Upload failed. Try again.')
      setUploadedImages(prev => prev.map((img, i) => {
        if (i >= startIndex && i < startIndex + files.length) {
          return { ...img, uploading: false, failed: true }
        }
        return img
      }))
    }

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
    sessionStorage.setItem('brevlo_order_data', JSON.stringify({
      form,
      uploadedImages: uploadedImages.filter(img => img.url && !img.failed)
    }))
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

      {/* Top area — BACK btn adjacent to step label + heading (flex row) */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '24px 24px 0', display: 'flex', gap: '36px', alignItems: 'flex-start' }}>

        {/* Left: back button */}
        <div style={{ flexShrink: 0, paddingTop: '3px' }}>
          <a href="/order" className="nb-btn-yellow" style={{
            fontSize: '12px', padding: '8px 20px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            textDecoration: 'none'
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            BACK
          </a>
        </div>

        {/* Right: step label + heading + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ paddingBottom: '36px' }}
        >
          <div className="label-tag" style={{ display: 'inline-block', marginBottom: '16px' }}>
            STEP 01 / 02 — BRIEF
          </div>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5vw, 3.8rem)',
            fontFamily: 'var(--font-rocket)',
            lineHeight: 1.0, color: '#fff', marginBottom: '12px'
          }}>
            TELL US ABOUT THE<br /><span style={{ color: 'var(--yellow)' }}>VIDEO.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', margin: 0 }}>
            The more we know, the better we design. Takes about 2 minutes.
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>
        <motion.form
          onSubmit={handleContinue}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >

          {/* Name + Email — 2 col */}
          <div className="name-email-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div data-err={formErrors.name ? 'true' : undefined}>
              <label style={lblOut}>YOUR NAME <span style={{ color: 'var(--red)' }}>*</span></label>
              <div className={`form-box${formErrors.name ? ' form-box-err' : ''}`} style={{ marginBottom: 0 }}>
                <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="John Creator" style={inp} />
              </div>
              {formErrors.name && <div style={errStyle}>{formErrors.name}</div>}
            </div>
            <div data-err={formErrors.email ? 'true' : undefined}>
              <label style={lblOut}>YOUR EMAIL <span style={{ color: 'var(--red)' }}>*</span></label>
              <div className={`form-box${formErrors.email ? ' form-box-err' : ''}`} style={{ marginBottom: 0 }}>
                <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@email.com" style={inp} />
              </div>
              {formErrors.email && <div style={errStyle}>{formErrors.email}</div>}
            </div>
          </div>

          {/* Video Title */}
          <div style={{ marginBottom: '16px' }} data-err={formErrors.title ? 'true' : undefined}>
            <label style={lblOut}>VIDEO TITLE / CONCEPT <span style={{ color: 'var(--red)' }}>*</span></label>
            <div className={`form-box${formErrors.title ? ' form-box-err' : ''}`} style={{ marginBottom: 0 }}>
              <input type="text" value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="e.g. I Tried Apple Vision Pro For 30 Days" style={inp} />
            </div>
            {formErrors.title && <div style={errStyle}>{formErrors.title}</div>}
          </div>

          {/* Niche — no wrapper box, buttons sit directly on bg */}
          <div style={{ marginBottom: '16px' }} data-err={formErrors.niche ? 'true' : undefined}>
            <label style={lblOut}>NICHE <span style={{ color: 'var(--red)' }}>*</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }} className="niche-grid">
              {NICHES.map(n => {
                const active = form.niche === n
                return (
                  <button key={n} type="button" onClick={() => updateForm('niche', n)} style={{
                    padding: '11px 8px', fontSize: '11px', fontWeight: 900,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    border: '2px solid #0A0A0A',
                    background: active ? 'var(--yellow)' : '#fff',
                    color: '#0A0A0A', boxShadow: '3px 3px 0 #0A0A0A',
                    cursor: 'pointer', transition: 'background 0.1s',
                    fontFamily: 'var(--font-body)'
                  }}>{n}</button>
                )
              })}
            </div>
            {formErrors.niche && <div style={{ ...errStyle, marginTop: '8px' }}>{formErrors.niche}</div>}
          </div>

          {/* Brief */}
          <div style={{ marginBottom: '16px' }} data-err={formErrors.brief ? 'true' : undefined}>
            <label style={lblOut}>THE BRIEF <span style={{ color: 'var(--red)' }}>*</span></label>
            <div className={`form-box${formErrors.brief ? ' form-box-err' : ''}`} style={{ marginBottom: 0 }}>
              <textarea value={form.brief} onChange={e => updateForm('brief', e.target.value)}
                placeholder="What's the hook? Who's the audience? Any must-have text, expressions, colors? (3–4 sentences is plenty)"
                rows={5} style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }}
              />
            </div>
            {formErrors.brief && <div style={errStyle}>{formErrors.brief}</div>}
          </div>

          {/* Images — standalone, no form-box wrapper */}
          <div style={{ marginBottom: '16px' }}>
            <label style={lblOut}>IMAGES TO USE / REFERENCES <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>* (OPTIONAL)</span></label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadedImages.length >= 10} style={{
              width: '100%', padding: '32px 20px',
              background: '#fff',
              border: '3px solid #0A0A0A',
              boxShadow: '5px 5px 0 #0A0A0A',
              color: '#0A0A0A',
              cursor: uploadedImages.length >= 10 ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              opacity: uploadedImages.length >= 10 ? 0.5 : 1,
              transition: 'border-color 0.15s',
              marginBottom: uploadedImages.length > 0 ? '14px' : 0,
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '28px', lineHeight: 1, color: 'rgba(0,0,0,0.4)' }}>↑</span>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)' }}>
                {uploadedImages.length >= 10 ? 'MAX 10 REACHED' : 'DROP REFERENCE IMAGES · PNG / JPG · UP TO 10'}
              </span>
            </button>
            {uploadError && <div style={{ ...errStyle, marginBottom: '10px' }}>{uploadError}</div>}
            {uploadedImages.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {uploadedImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '72px', height: '54px' }}>
                    <img src={img.preview} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid #0A0A0A', opacity: img.uploading ? 0.6 : 1, display: 'block' }} />
                    {img.uploading && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#0A0A0A', borderRadius: '50%' }}
                        />
                      </div>
                    )}
                    {img.failed && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.35)', fontSize: '18px', fontWeight: 900, color: '#fff' }}>!</div>
                    )}
                    <button type="button" onClick={() => removeImage(i)} style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#ef4444', border: 'none', color: '#fff',
                      fontSize: '11px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Channel */}
          <div style={{ marginBottom: '16px' }}>
            <label style={lblOut}>YOUR CHANNEL <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>* (OPTIONAL)</span></label>
            <div className="form-box" style={{ marginBottom: 0 }}>
              <input type="url" value={form.channel} onChange={e => updateForm('channel', e.target.value)} placeholder="youtube.com/@yourhandle" style={inp} />
            </div>
          </div>

          {/* Bottom action bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
              STEP 1 OF 2 · NEXT: PAYMENT
            </div>
            <button type="submit" className="nb-btn-yellow continue-btn" style={{ fontSize: '15px', padding: '18px 36px', fontFamily: 'inherit', cursor: 'pointer' }}>
              CONTINUE TO PAYMENT →
            </button>
          </div>

        </motion.form>
      </div>

      <style>{`
        .form-box {
          background: #fff;
          border: 3px solid #0A0A0A;
          box-shadow: 5px 5px 0 #0A0A0A;
          padding: 0;
          color: #0A0A0A;
          margin-bottom: 16px;
          transition: box-shadow 0.15s ease;
        }
        .form-box:focus-within {
          box-shadow: 5px 5px 0 var(--yellow);
        }
        .form-box-err {
          border-color: var(--red) !important;
          box-shadow: 5px 5px 0 var(--red) !important;
        }
        .form-box input, .form-box textarea {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          background: #fff;
        }
        .continue-btn {
          transition: transform 0.1s ease, box-shadow 0.1s ease !important;
        }
        .continue-btn:hover {
          transform: translate(3px, 3px) !important;
          box-shadow: 3px 3px 0 var(--black) !important;
        }
        .continue-btn:active {
          transform: translate(6px, 6px) !important;
          box-shadow: 0px 0px 0 var(--black) !important;
        }
        @media (max-width: 600px) {
          .name-email-grid { grid-template-columns: 1fr !important; }
          .niche-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}

const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 800,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.5)', marginBottom: '10px'
}

const lblOut = {
  display: 'block', fontSize: '11px', fontWeight: 800,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.65)', marginBottom: '8px'
}

const inp = {
  width: '100%', padding: '13px 16px', fontSize: '15px',
  background: '#fff', color: '#0A0A0A',
  border: '3px solid #0A0A0A', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
  display: 'block', boxSizing: 'border-box'
}

const errStyle = {
  fontSize: '11px', color: 'var(--red)', fontWeight: 700,
  marginTop: '6px', letterSpacing: '0.04em'
}
