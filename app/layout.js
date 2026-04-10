import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Brevlo Media | Pure CTR Design',
  description: 'Human-crafted thumbnails that destroy AI slop. We engineer the psychology of the click.',
  openGraph: {
    title: 'Brevlo Media | Pure CTR Design',
    description: 'Human-crafted thumbnails that destroy AI slop.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable}`}>{children}</body>
    </html>
  )
}
