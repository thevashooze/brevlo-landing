'use client'

export default function Navbar() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{ background: 'linear-gradient(to bottom, rgba(10,10,11,0.95), transparent)' }}>

      {/* Logo */}
      <span className="text-2xl font-bold tracking-widest text-white uppercase">
        BREVLO
      </span>

      {/* Nav Links */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => scrollTo('portfolio')}
          className="px-5 py-2 text-sm font-medium tracking-widest text-gray-300 uppercase border border-transparent rounded-full hover:border-purple-500 hover:text-white transition-all duration-200">
          Portfolio
        </button>
        <button
          onClick={() => scrollTo('about')}
          className="px-5 py-2 text-sm font-medium tracking-widest text-gray-300 uppercase border border-transparent rounded-full hover:border-purple-500 hover:text-white transition-all duration-200">
          About
        </button>
        <button
          onClick={() => scrollTo('contact')}
          className="px-5 py-2 text-sm font-semibold tracking-widest text-white uppercase rounded-full transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
          Contact
        </button>
      </div>
    </nav>
  )
}
