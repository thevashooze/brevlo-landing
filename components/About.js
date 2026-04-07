'use client'

const stats = [
  { value: '500+', label: 'Thumbnails Delivered' },
  { value: '98%', label: 'Client Retention' },
  { value: '2.4×', label: 'Avg CTR Increase' },
  { value: '48h', label: 'Turnaround Time' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section Label */}
        <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#a855f7' }}>
          Who We Are
        </p>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — Heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tight leading-tight text-white">
              WE DON'T JUST DESIGN.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                WE ENGINEER CLICKS.
              </span>
            </h2>

            <div className="mt-8 w-16 h-1 rounded-full" style={{ background: '#a855f7' }} />
          </div>

          {/* Right — Description */}
          <div className="flex flex-col gap-5">
            <p className="text-gray-400 text-base font-light leading-relaxed tracking-wide">
              Brevlo is a data-driven thumbnail agency built for creators who take growth seriously.
              We study what makes viewers click — psychology, color theory, composition — and turn
              that into visuals that perform.
            </p>
            <p className="text-gray-400 text-base font-light leading-relaxed tracking-wide">
              Every thumbnail we create is backed by research, not guesswork. From facecam shots to
              cinematic concepts, we build visuals that compete at the highest level on YouTube.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl border text-center"
              style={{ borderColor: '#1f1f23', background: '#111114' }}>
              <p className="text-4xl font-bold mb-2" style={{ color: '#a855f7' }}>
                {stat.value}
              </p>
              <p className="text-xs font-medium tracking-widest uppercase text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
