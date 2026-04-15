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
    <div className="border border-white/15 px-5 py-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/60 font-black text-sm uppercase tracking-wide">{label}</span>
        <span
          className="font-black text-black text-base px-3 py-0.5 border-2 border-black min-w-[70px] text-center"
          style={{ background: '#FFE600', boxShadow: '2px 2px 0 #0A0A0A' }}
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
        style={{ background: `linear-gradient(to right, #A033FF ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
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
    <section ref={ref} className="section">
      <div className="container">

        {/* Heading — Satoshi, not Rocket Thunder */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="label-tag mb-5 inline-block">ROI Calculator</span>
          <h2
            className="font-rocket text-white leading-none mb-3"
            style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}
          >
            DO THE <span style={{ color: '#FFE600' }}>MATH.</span>
          </h2>
          <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
            Adjust your numbers. See your projected ROI live.
          </p>
        </motion.div>

        {/* Calculator — compact, no yellow shadow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="border border-white/10 overflow-hidden flex flex-col lg:flex-row"
        >

          {/* LEFT — inputs */}
          <div
            className="flex-1 p-7 border-b lg:border-b-0 lg:border-r border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <p className="font-black text-white/25 text-[10px] uppercase tracking-[0.2em] mb-5">Your Channel Numbers</p>

            <div className="flex flex-col gap-3">
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
            <div
              className="mt-5 px-5 py-4 flex items-center gap-4 border border-black/20"
              style={{ background: '#A033FF', boxShadow: '4px 4px 0 #0A0A0A' }}
            >
              <div className="w-8 h-8 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-[#FFE600] font-black text-[10px] uppercase tracking-widest mb-0.5">Brevlo CTR Multiplier</p>
                <p className="text-white font-black text-lg">
                  {currentCTR.toFixed(1)}% → <span style={{ color: '#FFE600' }}>{newCTR.toFixed(1)}%</span>
                  <span className="text-white/40 text-sm font-semibold ml-2">(1.5× avg)</span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="flex-1 p-7 flex flex-col gap-4" style={{ background: '#0A0A0A' }}>
            <p className="font-black text-white/20 text-[10px] uppercase tracking-[0.2em]">Projected</p>

            {/* Big revenue */}
            <div className="border border-white/10 p-5 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-white/35 font-black text-[10px] uppercase tracking-widest mb-2">Extra Monthly Revenue</p>
              <p
                className="font-black leading-none"
                style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#00CC6A' }}
              >
                {fmtUSD(extraRevenue)}
              </p>
            </div>

            {/* Revenue lift badge */}
            <div className="text-center px-5 py-3 border border-[#A033FF]" style={{ background: '#A033FF' }}>
              <span className="text-white font-black text-sm uppercase tracking-widest">
                Revenue Lift: <span style={{ color: '#FFE600' }}>{revLift.toLocaleString()}%</span>
              </span>
            </div>

            {/* Breakdown */}
            <div className="flex flex-col gap-1.5 flex-1">
              {[
                { label: 'CTR Improvement', val: `+${(newCTR - currentCTR).toFixed(1)} pts` },
                { label: 'Algo Boost Views', val: `+${fmt(Math.round(algoBoost))}` },
                { label: 'Brevlo Cost',      val: '$20' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 border border-white/8" style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <span className="text-white/45 font-black text-xs uppercase tracking-wide">{r.label}</span>
                  <span className="text-white font-black text-sm">{r.val}</span>
                </div>
              ))}
            </div>

            {/* ROI */}
            <div className="px-5 py-5 text-center border border-[#FFE600]" style={{ background: '#FFE600' }}>
              <p className="text-black/50 font-black text-[10px] uppercase tracking-widest mb-1">Return On Investment</p>
              <p className="font-black text-black leading-none" style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)' }}>
                {roi > 0 ? `${roi}×` : '0×'}
              </p>
              <p className="text-black/45 font-black text-[10px] mt-1 uppercase tracking-wide">
                Pays for itself in 1 order
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
