'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function mapSliderToViews(v) {
  if (v <= 70) return Math.max(1000, Math.round((v / 70) * 1000000))
  if (v <= 90) return Math.round(1000000 + ((v - 70) / 20) * 4000000)
  return Math.round(5000000 + ((v - 90) / 10) * 5000000)
}
function mapViewsToSlider(views) {
  if (views <= 1000000) return (views / 1000000) * 70
  if (views <= 5000000) return 70 + ((views - 1000000) / 4000000) * 20
  return 90 + ((views - 5000000) / 5000000) * 10
}
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toString()
}
function fmtUSD(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function Slider({ label, value, min, max, step, onChange, display, sliderVal, onSliderChange }) {
  const pct = (((sliderVal ?? value) - min) / (max - min)) * 100
  return (
    <div className="border-4 border-black p-5 bg-white" style={{ boxShadow: '4px 4px 0 #0A0A0A' }}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-black font-black text-base uppercase tracking-wide">{label}</span>
        <span
          className="font-black text-black text-lg px-4 py-1 border-4 border-black min-w-[80px] text-center"
          style={{ background: '#FFE600', boxShadow: '3px 3px 0 #0A0A0A' }}
        >
          {display}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={sliderVal ?? value}
        onChange={e => {
          const v = Number(e.target.value)
          onSliderChange ? onSliderChange(v) : onChange(v)
        }}
        style={{ background: `linear-gradient(to right, #A033FF ${pct}%, #e5e7eb ${pct}%)` }}
        className="w-full"
      />
    </div>
  )
}

export default function ROICalculator() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [vSlider,    setVSlider]    = useState(mapViewsToSlider(500000))
  const [views,      setViews]      = useState(500000)
  const [currentCTR, setCurrentCTR] = useState(3.5)
  const [rpm,        setRpm]        = useState(4)

  const newCTR       = currentCTR * 1.5
  const extraFromCTR = views * ((newCTR - currentCTR) / 100)
  const algoBoost    = views * 0.20
  const extraRevenue = (extraFromCTR + algoBoost) * (rpm / 1000)
  const roi          = Math.round(extraRevenue / 20)
  const revLift      = extraRevenue > 0 ? Math.round((extraRevenue / 20) * 100) : 0

  return (
    <section ref={ref} className="relative w-full py-20 px-4">
      <div className="container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-rocket text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
            DO THE <span style={{ color: '#FFE600' }}>MATH.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Adjust your numbers — see your projected ROI live
          </p>
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl border-4 border-black overflow-hidden shadow-[20px_20px_0_#FFE600] flex flex-col lg:flex-row"
        >

          {/* LEFT — inputs */}
          <div className="flex-1 p-8 sm:p-10 border-b-4 lg:border-b-0 lg:border-r-4 border-black" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="font-black text-white/30 text-xs uppercase tracking-[0.2em] mb-6">Your Channel Numbers</p>

            <div className="flex flex-col gap-4">
              <Slider
                label="Monthly Views"
                value={views} min={0} max={100} step={1}
                sliderVal={vSlider}
                display={fmt(views)}
                onSliderChange={v => { setVSlider(v); setViews(mapSliderToViews(v)) }}
                onChange={setViews}
              />
              <Slider
                label="Current CTR"
                value={currentCTR} min={0.5} max={15} step={0.1}
                display={`${currentCTR.toFixed(1)}%`}
                onChange={setCurrentCTR}
              />
              <Slider
                label="RPM (per 1K views)"
                value={rpm} min={0.5} max={50} step={0.5}
                display={`$${rpm.toFixed(1)}`}
                onChange={setRpm}
              />
            </div>

            {/* CTR badge */}
            <div className="mt-6 border-4 border-black p-5 flex items-center gap-4" style={{ background: '#A033FF', boxShadow: '6px 6px 0 #0A0A0A' }}>
              <div className="w-10 h-10 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-[#FFE600] font-black text-xs uppercase tracking-widest mb-1">Brevlo CTR Multiplier</p>
                <p className="text-white font-black text-xl">
                  {currentCTR.toFixed(1)}% → <span style={{ color: '#FFE600' }}>{newCTR.toFixed(1)}%</span>
                  <span className="text-white/40 text-sm font-semibold ml-2">(1.5× avg)</span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="flex-1 p-8 sm:p-10 flex flex-col gap-5" style={{ background: '#0A0A0A' }}>
            <p className="font-black text-white/20 text-xs uppercase tracking-[0.2em]">Projected</p>

            {/* Big revenue */}
            <div className="border-4 border-white/10 p-6 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white/40 font-black text-xs uppercase tracking-widest mb-3">Extra Monthly Revenue</p>
              <p className="font-rocket text-[#FFE600] leading-none" style={{ fontSize: 'clamp(3.5rem,7vw,6rem)' }}>
                {fmtUSD(extraRevenue)}
              </p>
            </div>

            {/* Revenue lift badge */}
            <div className="text-center border-4 border-[#A033FF] px-6 py-3" style={{ background: '#A033FF' }}>
              <span className="text-white font-black text-sm uppercase tracking-widest">
                Revenue Lift: <span style={{ color: '#FFE600' }}>{revLift.toLocaleString()}%</span>
              </span>
            </div>

            {/* Breakdown */}
            <div className="flex flex-col gap-2 flex-1">
              {[
                { label: 'CTR Improvement', val: `+${(newCTR - currentCTR).toFixed(1)} pts` },
                { label: 'Algo Boost Views', val: `+${fmt(Math.round(algoBoost))}` },
                { label: 'Brevlo Cost',      val: '$20' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3.5 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-white/50 font-black text-sm uppercase tracking-wide">{r.label}</span>
                  <span className="text-white font-black text-base">{r.val}</span>
                </div>
              ))}
            </div>

            {/* ROI */}
            <div className="border-4 border-[#FFE600] p-6 text-center" style={{ background: '#FFE600' }}>
              <p className="text-black/60 font-black text-xs uppercase tracking-widest mb-2">Return On Investment</p>
              <p className="font-rocket text-black leading-none" style={{ fontSize: '4rem' }}>
                {roi > 0 ? `${roi}×` : '—'}
              </p>
              <p className="text-black/50 font-black text-xs mt-2 uppercase tracking-wide">
                Pays for itself in 1 order
              </p>
            </div>

            {/* Fun fact */}
            <div className="border-4 border-white/20 px-5 py-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-white/30 font-black text-xs uppercase tracking-widest mb-1">Fun Fact</p>
              <p className="text-white/60 font-bold text-sm">A bad thumbnail costs more than a top-tier designer.</p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
