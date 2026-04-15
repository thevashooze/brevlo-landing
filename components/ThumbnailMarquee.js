'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const thumbnails = [
  { id: 1,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/detective%20(3).jpg', label: 'Detective' },
  { id: 2,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/drag%20race.jpg', label: 'Drag Race' },
  { id: 3,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/drift%20like%20a%20pro%20roblox.jpg', label: 'Drift Roblox' },
  { id: 4,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/every%20nationality.jpg', label: 'Every Nationality' },
  { id: 5,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/fake%20burger%20queen.jpg', label: 'Fake Burger Queen' },
  { id: 6,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/getting%20rich%20thumbnail.jpg', label: 'Getting Rich' },
  { id: 7,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/haytale%20game%202.jpg', label: 'Haytale Game' },
  { id: 8,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/he%20is%20back%20travis%201.jpg', label: 'He Is Back' },
  { id: 9,  src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/history%20churchill.jpg', label: 'Churchill' },
  { id: 10, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/living%20in%20bunker%20day%203.jpg', label: 'Living in Bunker' },
  { id: 11, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/living%20in%20poorest%20city%20no%20text.jpg', label: 'Poorest City' },
  { id: 12, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/minecraft%20movie.jpg', label: 'Minecraft Movie' },
  { id: 13, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/robert%20openhiemer.jpg', label: 'Oppenheimer' },
  { id: 14, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/roblox%20rivals.jpg', label: 'Roblox Rivals' },
  { id: 15, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/sample%20for%20different%20plot%20cindrella%20story.jpg', label: 'Cinderella' },
  { id: 16, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/short%20niches%20with%20high.jpg', label: 'Short Niches' },
  { id: 17, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/spongebob%20patty%20wagon%20great.jpg', label: 'Spongebob' },
  { id: 18, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/stalin%20assasination%202.jpg', label: 'Stalin' },
  { id: 19, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/tier%20list%20cypher%201.jpg', label: 'Tier List Cypher' },
  { id: 20, src: 'https://fljpubrqsmxwpsndotay.supabase.co/storage/v1/object/public/portfolio/wowaowoaw.jpg', label: 'Wowaowoaw' },
]

const row1 = thumbnails.slice(0, 5)
const row2 = thumbnails.slice(5, 10)
const row3 = thumbnails.slice(10, 15)
const row4 = thumbnails.slice(15, 20)

const makeLoop = (arr) => [...arr, ...arr, ...arr, ...arr]

function ThumbnailCard({ item }) {
  return (
    <div
      className="flex-shrink-0 w-[220px] md:w-[300px] lg:w-[340px] mx-2.5 overflow-hidden border-4 border-white shadow-[0_8px_0_#0A0A0A] transition-all duration-[80ms] ease-out cursor-pointer hover:translate-y-[8px] hover:shadow-none hover:border-[#FFE600]"
      style={{ aspectRatio: '16/9' }}
    >
      <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
    </div>
  )
}

function MarqueeRow({ items, direction = 'left', speed = 'normal' }) {
  const animClass = direction === 'left'
    ? (speed === 'fast' ? 'animate-marquee-left-fast' : 'animate-marquee-left')
    : (speed === 'fast' ? 'animate-marquee-right-fast' : 'animate-marquee-right')

  return (
    <div className="flex marquee-track">
      <div className={`flex ${animClass}`}>
        {makeLoop(items).map((item, i) => (
          <ThumbnailCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function ThumbnailMarquee() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="portfolio" className="py-16 overflow-hidden flex flex-col items-center w-full scroll-mt-20" ref={ref}>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-12 px-4 w-full"
      >
        <h2 className="font-black text-white text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase tracking-tight leading-[0.95] mb-3">
          RECENT <span style={{ color: '#FFE600' }}>PROJECTS</span>
        </h2>
        <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
          Thumbnails that stopped the scroll
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className="flex flex-col gap-6 w-full"
      >
        <MarqueeRow items={row1} direction="left"  speed="normal" />
        <MarqueeRow items={row2} direction="right" speed="fast"   />
        <MarqueeRow items={row3} direction="left"  speed="fast"   />
        <MarqueeRow items={row4} direction="right" speed="normal" />
      </motion.div>

    </section>
  )
}
