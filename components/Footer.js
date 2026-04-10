'use client'

export default function Footer() {
  return (
    <footer className="footer bg-[#060410] border-t-[6px] border-black py-12 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="flex flex-col items-center md:items-start">
          <p className="font-display font-black text-3xl tracking-widest text-white mb-2" style={{ textShadow: '3px 3px 0 #A033FF' }}>
            BREVLO
          </p>
          <p className="text-[#A033FF] font-black text-xs tracking-widest uppercase">
            Pure CTR. Human Craft.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {['Instagram', 'Twitter / X', 'YouTube'].map((name) => (
            <a
              key={name}
              href="#"
              className="bg-white border-4 border-black px-4 py-2 font-black text-black text-xs uppercase tracking-widest shadow-[4px_4px_0_#A033FF] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#A033FF] transition-all"
            >
              {name}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="text-white/40 font-black text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} Brevlo. All rights reserved.
          </p>
          <p className="text-white/20 font-black text-[9px] tracking-widest uppercase mt-1">
            Built for those who refuse to be ignored.
          </p>
        </div>

      </div>
    </footer>
  )
}
