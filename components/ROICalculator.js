'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* Formula: extraRevenue = (views / 1000) * RPM * (ctrIncrease / currentCTR) 
   Wait, if we increase CTR, extra views = views * (ctrIncrease / currentCTR)?
   Actually, the user had: views * (ctrIncrease/100) * 66.67.
   Let's integrate RPM: views * (ctrIncrease/100) * RPM.
*/
/* Map slider (0-100) to views (100 - 10M) 
   0-70: 100 to 5M (linear-ish)
   71-100: 5M to 10M steps
*/
function mapValueToViews(val) {
  if (val <= 70) return Math.round((val / 70) * 5000000) || 100
  if (val <= 80) return 7000000
  if (val <= 90) return 8000000
  if (val <= 95) return 9000000
  return 10000000
}

function mapViewsToValue(views) {
  if (views <= 5000000) return (views / 5000000) * 70
  if (views <= 7000000) return 75
  if (views <= 8000000) return 85
  if (views <= 9000000) return 93
  return 100
}

function calcRevenue(views, ctrIncrease, rpm) {
  return views * (ctrIncrease / 100) * rpm
}

function formatAbbr(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toString()
}

/* Styled slider with integrated text/number input */
function Slider({ label, value, min, max, step, onChange, formatDisplay, isAbbrDisplay, sliderValue, onSliderChange }) {
  const displayVal = value
  const pct = (((sliderValue !== undefined ? sliderValue : value) - min) / (max - min)) * 100
  const [isEditing, setIsEditing] = useState(false)
  const [tempVal, setTempVal] = useState(value)

  return (
    <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[6px_6px_0_#000] w-full mb-4 hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-center mb-4 gap-2">
        <label className="text-black font-black text-[clamp(14px,1.5vw,18px)] tracking-wide uppercase">
          {label}
        </label>
        
        {/* Number Editor block */}
        <div className="flex items-center gap-2 bg-[#f4f4f4] border-4 border-black rounded-lg px-2 py-1 shadow-[4px_4px_0_#A033FF]">
           {isAbbrDisplay && !isEditing ? (
             <div 
               className="text-black font-black text-lg w-20 text-center cursor-text select-none"
               onClick={() => { setIsEditing(true); setTempVal(value); }}
             >
               {formatAbbr(value)}
             </div>
           ) : (
             <input
               type="number"
               className={`bg-transparent text-black font-black text-lg w-20 outline-none text-center appearance-none`}
               min={min} max={max} step={step}
               value={isEditing ? tempVal : value}
               autoFocus={isEditing}
               onBlur={() => {
                 if (isAbbrDisplay) setIsEditing(false);
                 onChange(Number(tempVal) || value)
               }}
               onChange={(e) => {
                  let val = e.target.value
                  setTempVal(val)
                  if (!isAbbrDisplay) onChange(Number(val))
               }}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   if (isAbbrDisplay) setIsEditing(false);
                   onChange(Number(tempVal) || value)
                 }
               }}
             />
           )}
           {!isAbbrDisplay && <span className="text-black font-black text-md">{formatDisplay}</span>}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min} max={max} step={step}
          value={sliderValue !== undefined ? sliderValue : value}
          onChange={(e) => {
            if (onSliderChange) {
              onSliderChange(Number(e.target.value))
            } else {
              onChange(Number(e.target.value))
            }
            if (isEditing) setTempVal(e.target.value)
          }}
          style={{ background: `linear-gradient(to right, #A033FF ${pct}%, #E5E5E5 ${pct}%)` }}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default function ROICalculator() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [views,       setViews]       = useState(1000000)
  const [currentCTR,  setCurrentCTR]  = useState(3.8)
  const [ctrIncrease, setCtrIncrease] = useState(5)
  const [rpm,         setRpm]         = useState(66.67) // Default RPM

  // View slider mapping state
  const [vSlider, setVSlider] = useState(mapViewsToValue(1000000))

  // Clamp values
  const safeViews = Math.max(100, Math.min(views, 10000000))
  const safeCtrInc = Math.max(0.1, Math.min(ctrIncrease, 20))
  const safeCurrentCtr = Math.max(0.1, Math.min(currentCTR, 20))

  const extra       = calcRevenue(safeViews, safeCtrInc, rpm)
  // Revenue Lift capped at 100% and calculated as percent increase over baseline
  const liftRaw     = (safeCtrInc / safeCurrentCtr) * 100
  const roiPct      = Math.min(100, Math.round(liftRaw)) 

  const fmtUSD      = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <section ref={ref} className="relative w-full py-16 px-4 overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="w-full"
        >
          {/* Main Title */}
          <div className="text-center mb-10">
            <h2 className="display-heading text-white text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-center" style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.1)' }}>
               IS $20 WORTH $2,000?<br/>
               DO THE MATH.
            </h2>
          </div>

          <div className="bg-[#A033FF] border-4 border-black p-5 sm:p-8 rounded-[1.5rem] shadow-[12px_12px_0_#000] w-full flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* Sliders Area */}
            <div className="flex flex-col flex-1 justify-center">
              <Slider 
                label="Views" 
                value={views} 
                sliderValue={vSlider}
                min={0} max={100} step={1} 
                onSliderChange={(val) => {
                  setVSlider(val)
                  setViews(mapValueToViews(val))
                }}
                onChange={(val) => {
                  setViews(val)
                  setVSlider(mapViewsToValue(val))
                }}
                isAbbrDisplay={true}
              />
              <Slider 
                label="RPM ($)" 
                value={rpm} 
                min={0.5} max={150} step={0.1} 
                onChange={setRpm} 
                formatDisplay="$"
              />
              <Slider 
                label="Current CTR" 
                value={currentCTR} 
                min={0.1} max={20} step={0.1} 
                onChange={setCurrentCTR} 
                formatDisplay="%" 
              />
              <Slider 
                label="Potential CTR Increase" 
                value={ctrIncrease} 
                min={0.1} max={20} step={0.1} 
                onChange={setCtrIncrease} 
                formatDisplay="%" 
              />
            </div>

            {/* Output box Area */}
            <div className="flex-1 flex flex-col justify-center h-full min-h-[400px]">
              <div className="bg-black border-4 border-white rounded-2xl p-6 sm:p-8 text-center shadow-[8px_8px_0_#000] relative overflow-hidden mb-6 h-full flex flex-col justify-center hover:-translate-y-2 hover:shadow-[12px_12px_0_#000] transition-all">
                <p className="text-[#EFC5FF] font-black text-xl mb-2 tracking-widest uppercase">PROJECTED</p>
                {/* Changed "EXTRA REVENUE" color to green */}
                <p className="text-[#22c55e] font-display text-[clamp(2.5rem,5vw,3.5rem)] font-black leading-none mb-6 tracking-tighter" style={{ textShadow: '4px 4px 0 #FFF' }}>
                  EXTRA REVENUE
                </p>
                <div className="bg-white border-4 border-black text-black px-6 py-4 w-max max-w-full overflow-hidden mx-auto shadow-[6px_6px_0_#A033FF] rotate-[-2deg] hover:rotate-0 transition-transform">
                   <p className="font-black text-[clamp(2rem,4vw,3.5rem)] leading-none">{fmtUSD(extra)}</p>
                </div>
                <div className="mt-8">
                   <p className="text-white text-base uppercase font-black tracking-widest bg-[#A033FF] border-4 border-black inline-block px-4 py-2 shadow-[4px_4px_0_#FFF]">
                     REVENUE LIFT: {roiPct.toLocaleString()}%
                   </p>
                </div>
              </div>

              {/* System log -> Fun Fact Joke */}
              <div className="bg-white border-4 border-black rounded-xl p-4 font-mono text-[11px] sm:text-[13px] shadow-[4px_4px_0_#000] rotate-[1deg] w-full text-center">
                 <span className="text-[#A033FF] font-black uppercase tracking-widest">FUN FACT:</span><br/>
                 <span className="text-black font-bold uppercase">A BAD THUMBNAIL COSTS MORE THAN A TOP-TIER DESIGNER.</span>
              </div>
            </div>

          </div>

        </motion.div>
      </div>

      <style jsx>{`
         input[type=number]::-webkit-inner-spin-button, 
         input[type=number]::-webkit-outer-spin-button { 
           -webkit-appearance: none; 
           margin: 0; 
         }
      `}</style>
    </section>
  )
}
