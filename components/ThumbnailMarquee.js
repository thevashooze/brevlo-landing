'use client'

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
    <div className="flex-shrink-0 w-72 mx-3 rounded-2xl overflow-hidden border"
      style={{ borderColor: '#1f1f23', aspectRatio: '16/9' }}>
      <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
    </div>
  )
}

function MarqueeRow({ items, direction = 'left', speed = 'normal' }) {
  const animClass = direction === 'left'
    ? (speed === 'fast' ? 'animate-marquee-left-fast' : 'animate-marquee-left')
    : (speed === 'fast' ? 'animate-marquee-right-fast' : 'animate-marquee-right')

  return (
    <div className="flex overflow-hidden marquee-track">
      <div className={`flex ${animClass}`}>
        {makeLoop(items).map((item, i) => (
          <ThumbnailCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function ThumbnailMarquee() {
  return (
    <section id="portfolio" className="py-24 overflow-hidden">

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

      <div className="flex flex-col gap-5">
        <MarqueeRow items={row1} direction="left"  speed="normal" />
        <MarqueeRow items={row2} direction="right" speed="fast"   />
        <MarqueeRow items={row3} direction="left"  speed="fast"   />
        <MarqueeRow items={row4} direction="right" speed="normal" />
      </div>

    </section>
  )
}
