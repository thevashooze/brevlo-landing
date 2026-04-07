import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Brevlo | Beyond Visuals.',
  description: 'Brevlo is a data-driven agency that masters the psychology of the click for YouTube growth.',
  openGraph: {
    title: 'Brevlo | Beyond Visuals.',
    description: 'Brevlo is a data-driven agency that masters the psychology of the click for YouTube growth.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
