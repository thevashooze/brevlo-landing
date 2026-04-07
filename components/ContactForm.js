'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'

// ─────────────────────────────────────────────
// EmailJS Setup:
// 1. Go to https://emailjs.com and create a free account
// 2. Add a Gmail service → copy the Service ID
// 3. Create an email template → copy the Template ID
// 4. Go to Account → copy your Public Key
// 5. Replace the values below (or use .env.local)
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', channel: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          channel_link: form.channel,
          message: form.message,
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
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Section Label */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#a855f7' }}>
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight text-white">
            LET'S CREATE SOMETHING{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AMAZING TOGETHER
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-sm tracking-widest uppercase font-light">
            Tell us about your channel. We'll take it from there.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all focus:ring-1"
                style={{
                  background: '#111114',
                  border: '1px solid #1f1f23',
                  fontFamily: 'Oswald, sans-serif',
                }}
                onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all"
                style={{
                  background: '#111114',
                  border: '1px solid #1f1f23',
                  fontFamily: 'Oswald, sans-serif',
                }}
                onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium tracking-widest uppercase text-gray-500">YouTube Channel Link</label>
            <input
              type="url"
              name="channel"
              value={form.channel}
              onChange={handleChange}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all"
              style={{
                background: '#111114',
                border: '1px solid #1f1f23',
                fontFamily: 'Oswald, sans-serif',
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your channel, content style, and what you're looking for..."
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm font-light outline-none transition-all resize-none"
              style={{
                background: '#111114',
                border: '1px solid #1f1f23',
                fontFamily: 'Oswald, sans-serif',
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-4 rounded-xl text-sm font-semibold tracking-widest uppercase text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 30px rgba(168,85,247,0.2)' }}>
            {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Message Sent!' : "Let's Talk →"}
          </button>

          {status === 'error' && (
            <p className="text-center text-sm text-red-400 tracking-wide">
              Something went wrong. Please try again.
            </p>
          )}

        </form>
      </div>
    </section>
  )
}
