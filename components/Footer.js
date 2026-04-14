'use client'

export default function Footer() {
  return (
    <footer className="bg-[#060410] border-t-[6px] border-black py-12 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="flex flex-col items-center md:items-start">
          <p className="font-rocket text-4xl tracking-widest text-white mb-2" style={{ textShadow: '3px 3px 0 #A033FF' }}>
            BREVLO
          </p>
          <p className="font-black text-xs tracking-widest uppercase" style={{ color: '#FFE600' }}>
            Pure CTR. Human Craft.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Order Now',   href: '/order' },
            { label: 'Track Order', href: '/find-order' },
          ].map(({ label, href }) => (
            <a key={label} href={href}>
              <button className="nb-btn-yellow px-4 py-2 text-xs tracking-widest">
                {label}
              </button>
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
