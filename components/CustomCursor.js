'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      cursor.style.display = 'none'
      return
    }

    let mouseX = -100, mouseY = -100
    let curX = -100, curY = -100
    let raf

    const lerp = (a, b, t) => a + (b - a) * t

    const track = () => {
      curX = lerp(curX, mouseX, 0.13)
      curY = lerp(curY, mouseY, 0.13)
      cursor.style.transform = `translate(${curX}px, ${curY}px)`
      raf = requestAnimationFrame(track)
    }

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-hover]')
      if (el) cursor.classList.add('is-hovering')
    }

    const onOut = (e) => {
      const el = e.target.closest('a, button, [data-hover]')
      if (el) cursor.classList.remove('is-hovering')
    }

    const onDown = () => cursor.classList.add('is-clicking')
    const onUp   = () => cursor.classList.remove('is-clicking')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(track)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      {/* Default: geometric triangle arrow */}
      <svg className="cursor-arrow" width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 2.5L20 12.5L10.5 15.5L6.5 23.5L2.5 2.5Z" fill="#FFE600" stroke="#000" strokeWidth="2.2" strokeLinejoin="round"/>
      </svg>

      {/* Hover: retro hand pointer */}
      <svg className="cursor-hand" width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Index finger */}
        <rect x="9" y="1" width="7" height="17" rx="3.5" fill="white" stroke="black" strokeWidth="2"/>
        <line x1="9.5" y1="11" x2="15.5" y2="11" stroke="black" strokeWidth="1.2" opacity="0.35"/>
        {/* Middle finger */}
        <rect x="16" y="5" width="6" height="10" rx="3" fill="white" stroke="black" strokeWidth="2"/>
        {/* Ring finger */}
        <rect x="22" y="8" width="5" height="8" rx="2.5" fill="white" stroke="black" strokeWidth="1.8"/>
        {/* Pinky */}
        <rect x="1.5" y="14" width="5" height="7" rx="2.5" fill="white" stroke="black" strokeWidth="1.8"/>
        {/* Palm */}
        <path d="M3 18 C2 16 5 14 9 14 L20 14 C24 14 26 16 26 19 L26 27 C26 31 23 33 18 33 L10 33 C5 33 2 31 2 27 Z" fill="white" stroke="black" strokeWidth="2"/>
        {/* Palm lines */}
        <path d="M6 22 Q13 20 20 22" stroke="black" strokeWidth="1" opacity="0.2" fill="none"/>
      </svg>

      <style jsx>{`
        .custom-cursor.is-clicking .cursor-arrow {
          transform: scale(0.88);
        }
        .custom-cursor.is-clicking .cursor-hand {
          transform: scale(0.88) translateY(2px);
        }
      `}</style>
    </div>
  )
}
