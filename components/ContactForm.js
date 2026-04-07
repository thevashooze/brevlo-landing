'use client'

import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { motion, useInView } from 'framer-motion'

const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY'

const ease = [0.25, 0.1, 0.25, 1]

const inputStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
}

export default function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', channel: '', message: '' })
  const [status, setStatus] = useState('idle')

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    form.name,
          from_email:   form.email,
          channel_link: form.channel,
          message:      form.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', channel: '', message: '' })
    } catch (err) {
      console.error('EmailJS Error:', err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-32 px-6" ref={sectionRef}>
      <div className="max-w-xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ color: '#a855f7' }}>
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
            Let's create something{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              amazing together.
            </span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm tracking-[0.15em] uppercase font-light">
            Tell us about your channel. We'll take it from there.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium tracking-[0.18em] uppercase text-gray-600">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                onBlur={(e)  => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium tracking-[0.18em] uppercase text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                onBlur={(e)  => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium tracking-[0.18em] uppercase text-gray-600">YouTube Channel Link</label>
            <input
              type="url"
              name="channel"
              value={form.channel}
              onChange={handleChange}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all duration-200"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
              onBlur={(e)  => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium tracking-[0.18em] uppercase text-gray-600">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your channel, content style, and what you're looking for..."
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all duration-200 resize-none"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
              onBlur={(e)  => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-4 rounded-xl text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 0 40px rgba(168,85,247,0.18)',
            }}
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Message Sent!' : "Let's Talk →"}
          </button>

          {status === 'error' && (
            <p className="text-center text-sm text-red-400 tracking-wide">
              Something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
