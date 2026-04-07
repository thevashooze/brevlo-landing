'use client'

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />
      </div>

      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium tracking-widest uppercase"
        style={{ borderColor: 'rgba(168,85,247,0.3)', color: '#a855f7', background: 'rgba(168,85,247,0.06)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        YouTube Thumbnail Agency
      </div>

      {/* Headline */}
      <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6 uppercase">
        <span className="text-white">HI, WELCOME TO</span>
        <br />
        <span style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          BREVLO.
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl font-light tracking-widest text-gray-400 uppercase mb-10 max-w-xl">
        Beyond Visuals. We engineer the psychology of the click.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => scrollTo('contact')}
          className="px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-full text-white transition-all duration-200 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 30px rgba(168,85,247,0.3)' }}>
          Start Your Project →
        </button>
        <button
          onClick={() => scrollTo('portfolio')}
          className="px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-full text-gray-300 border transition-all duration-200 hover:border-purple-500 hover:text-white"
          style={{ borderColor: '#1f1f23', background: '#111114' }}>
          View Our Work
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs tracking-widest uppercase text-gray-500">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  )
}
