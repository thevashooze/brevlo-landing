'use client'

const socialLinks = [
  {
    name: 'Instagram',
    href: '#', // Replace with actual link
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: '#', // Replace with actual link
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#', // Replace with actual link
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="border-t py-12 px-6" style={{ borderColor: '#1f1f23' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Logo + tagline */}
        <div className="text-center md:text-left">
          <p className="text-2xl font-bold tracking-widest uppercase text-white">BREVLO</p>
          <p className="text-xs text-gray-600 tracking-widest uppercase mt-1">Beyond Visuals.</p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="w-10 h-10 flex items-center justify-center rounded-full border text-gray-400 transition-all duration-200 hover:text-white hover:border-purple-500"
              style={{ borderColor: '#1f1f23', background: '#111114' }}>
              {link.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-600 tracking-widest uppercase">
          © {new Date().getFullYear()} Brevlo. All rights reserved.
        </p>

      </div>
    </footer>
  )
}
