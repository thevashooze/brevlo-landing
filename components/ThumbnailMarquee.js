'use client'

// ─────────────────────────────────────────────
// REPLACE these src values with your actual thumbnail image URLs.
// Images should be 16:9 ratio (e.g. 640×360px).
// ─────────────────────────────────────────────
const thumbnails = [
  { id: 1, src: null, label: 'Project 01' },
  { id: 2, src: null, label: 'Project 02' },
  { id: 3, src: null, label: 'Project 03' },
  { id: 4, src: null, label: 'Project 04' },
  { id: 5, src: null, label: 'Project 05' },
]

// Placeholder gradients for when no image is provided
const placeholderGradients = [
  'linear-gradient(135deg, #a855f7, #7c3aed)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #ec4899, #be185d)',
  'linear-gradient(135deg, #8b5cf6, #a855f7)',
  'linear-gradient(135deg, #6366f1, #4f46e5)',
]

// Duplicate items for seamless infinite loop
const items = [...thumbnails, ...thumbnails, ...thumbnails, ...thumbnails]

function ThumbnailCard({ item, index }) {
  const gradient = placeholderGradients[item.id % placeholderGradients.length]
  return (
    <div className="flex-shrink-0 w-72 mx-3 rounded-2xl overflow-hidden border"
      style={{ borderColor: '#1f1f23', aspectRatio: '16/9' }}>
      {item.src ? (
        <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-end p-4" style={{ background: gradient }}>
          <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            {item.label}
          </span>
        </div>
      )}
    </div>
  )
}

function MarqueeRow({ direction = 'left', speed = 'normal' }) {
  const animClass = direction === 'left'
    ? (speed === 'fast' ? 'animate-marquee-left-fast' : 'animate-marquee-left')
    : (speed === 'fast' ? 'animate-marquee-right-fast' : 'animate-marquee-right')

  return (
    <div className="flex overflow-hidden marquee-track">
      <div className={`flex ${animClass}`}>
        {items.map((item, i) => (
          <ThumbnailCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function ThumbnailMarquee() {
  return (
    <section id="portfolio" className="py-24 overflow-hidden">

      {/* Section Label */}
      <div className="text-center mb-16 px-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#a855f7' }}>
          Our Work
        </p>
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
          Recent Projects
        </h2>
        <p className="mt-4 text-gray-500 text-sm tracking-widest uppercase font-light">
          Thumbnails that stopped the scroll
        </p>
      </div>

      {/* 4 Rows of sliding thumbnails */}
      <div className="flex flex-col gap-5">
        <MarqueeRow direction="left" speed="normal" />
        <MarqueeRow direction="right" speed="fast" />
        <MarqueeRow direction="left" speed="fast" />
        <MarqueeRow direction="right" speed="normal" />
      </div>

    </section>
  )
}
