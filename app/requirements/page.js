'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const NICHES = ['Gaming', 'Finance', 'History', 'Vlogs', 'Tech', 'Fitness', 'Education', 'Entertainment', 'Other']

export default function RequirementsPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', title: '', niche: '', brandingNotes: '' })
  const [refs, setRefs] = useState([''])
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [uploadError, setUploadError] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const fileInputRef = useRef(null)

  // Restore draft
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

  // Persist draft
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
      setUploadError('Max 5 reference images allowed')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('images', f))
      const res = await fetch('https://brevlo-backend.onrender.com/upload-references', { method: 'POST', body: fd })
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
    } catch {
      setUploadError('Image upload failed. Try again.')
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

  function handleContinue(e) {
    e?.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    // Save everything to sessionStorage for payment page
    sessionStorage.setItem('brevlo_order_data', JSON.stringify({
      form,
      refs: refs.filter(r => r.trim()),
      uploadedImages
    }))

    setTransitioning(true)
    setTimeout(() => router.push('/payment'), 520)
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Page transition overlay */}
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
        <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.12)' }}/>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          REQUIREMENTS LAB
        </div>
        {/* Step indicator */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', background: 'var(--yellow)', border: '2px solid var(--black)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 900, color: 'var(--black)'
            }}>1</div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--yellow)' }}>BRIEF</span>
          </div>
          <div style={{ width: '32px', height: '2px', background: 'rgba(255,255,255,0.15)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', background: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.35)'
            }}>2</div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>PAYMENT</span>
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
        <div className="label-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto 16px' }}>STEP 01 / 02 — BRIEF</div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'var(--font-rocket)',
          lineHeight: 1.0, color: '#fff', marginBottom: '14px'
        }}>
          BRIEF US. <span style={{ color: 'var(--yellow)' }}>WE'LL DO THE REST.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '460px', margin: '0 auto' }}>
          The more we know, the better the thumbnail. Fill this out completely.
        </p>
      </motion.div>

      {/* Form — single column, centered */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 100px' }}>
        <motion.form
          onSubmit={handleContinue}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

            {/* ── 01 YOUR DETAILS ── */}
            <FormSection number="01" label="YOUR DETAILS">
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
            </FormSection>

            {/* ── 02 YOUR VIDEO ── */}
            <FormSection number="02" label="YOUR VIDEO">
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
            </FormSection>

            {/* ── 03 CONTENT NICHE ── */}
            <FormSection number="03" label="CONTENT NICHE">
              <label style={labelStyle}>Pick your niche <span style={{ color: 'var(--yellow)' }}>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {NICHES.map(n => {
                  const active = form.niche === n
                  return (
                    <button
                      key={n} type="button"
                      onClick={() => { updateForm('niche', n); setFormErrors(p => ({ ...p, niche: '' })) }}
                      style={{
                        padding: '16px 12px',
                        fontSize: '13px', fontWeight: 900,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        border: `4px solid ${active ? 'var(--black)' : 'rgba(255,255,255,0.12)'}`,
                        background: active ? 'var(--yellow)' : 'rgba(255,255,255,0.03)',
                        color: active ? 'var(--black)' : 'rgba(255,255,255,0.55)',
                        boxShadow: active ? '4px 4px 0 var(--black)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                        fontFamily: 'var(--font-body)'
                      }}
                    >{n}</button>
                  )
                })}
              </div>
              {formErrors.niche && <div style={{ ...errStyle, marginTop: '10px' }}>{formErrors.niche}</div>}
            </FormSection>

            {/* ── 04 REFERENCES ── */}
            <FormSection number="04" label="REFERENCES">
              {/* URL references */}
              <label style={labelStyle}>Reference URLs <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>(up to 5)</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
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
                          width: '46px', height: '46px', flexShrink: 0,
                          background: 'rgba(239,68,68,0.08)', border: '3px solid rgba(239,68,68,0.25)',
                          color: 'var(--red)', cursor: 'pointer', fontSize: '20px',
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
              <label style={labelStyle}>Reference Images <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>(up to 5)</span></label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || uploadedImages.length >= 5}
                style={{
                  width: '100%', padding: '28px 20px', marginBottom: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '3px dashed rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.45)', cursor: (uploading || uploadedImages.length >= 5) ? 'not-allowed' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  opacity: uploadedImages.length >= 5 ? 0.5 : 1,
                  transition: 'border-color 0.15s',
                }}
              >
                {uploading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>UPLOADING...</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '32px', lineHeight: 1, fontWeight: 900 }}>↑</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>DROP OR CLICK TO UPLOAD · PNG / JPG</span>
                  </>
                )}
              </button>

              {uploadError && <div style={{ ...errStyle, marginBottom: '10px' }}>{uploadError}</div>}

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
                          fontSize: '11px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                        }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </FormSection>

            {/* ── 05 BRANDING & NOTES ── */}
            <FormSection number="05" label="BRANDING & NOTES">
              <label style={labelStyle}>Extra Instructions <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>(Optional)</span></label>
              <textarea
                value={form.brandingNotes}
                onChange={e => updateForm('brandingNotes', e.target.value)}
                placeholder="Brand colors, font preferences, tone (bold/clean/dark), text to include, face reveal or no, specific style..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
              />
            </FormSection>

          </div>

          {/* ── BOTTOM ACTION BAR ── */}
          <div style={{
            marginTop: '12px',
            padding: '24px 28px',
            background: '#0A0A0A',
            border: '4px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                STEP 1 OF 2
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Next: Review & Payment
              </div>
            </div>
            <motion.button
              type="submit"
              className="nb-btn-yellow"
              style={{ fontSize: '16px', padding: '18px 36px' }}
              whileHover={{ x: 3, y: 3, boxShadow: '4px 4px 0 var(--black)' }}
              whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0 var(--black)' }}
            >
              CONTINUE TO PAYMENT →
            </motion.button>
          </div>

        </motion.form>
      </div>

      <style>{`
        input:focus, textarea:focus { outline: none; border-color: var(--yellow) !important; box-shadow: 4px 4px 0 var(--yellow); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 640px) {
          .niche-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}

/* ── Section wrapper ── */
function FormSection({ number, label, children }) {
  return (
    <div style={{ background: '#0A0A0A', border: '4px solid rgba(255,255,255,0.08)', padding: '28px', borderBottom: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '20px', paddingBottom: '14px',
        borderBottom: '2px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 900, color: 'var(--yellow)',
          fontFamily: 'monospace', letterSpacing: '0.05em'
        }}>{number} /</span>
        <span style={{
          fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)'
        }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

/* ── Micro styles ── */
const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '10px'
}

const inputStyle = {
  width: '100%', padding: '13px 16px', fontSize: '15px',
  background: 'rgba(255,255,255,0.04)', color: '#fff',
  border: '3px solid rgba(255,255,255,0.12)', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s'
}

const errStyle = {
  fontSize: '11px', color: 'var(--red)', fontWeight: 700, marginTop: '5px', letterSpacing: '0.04em'
}
