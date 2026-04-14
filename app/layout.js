import './globals.css'

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
      <body>
        <div className="fixed inset-0 pointer-events-none z-[-1] grid-live-purple" />
        {children}
      </body>
    </html>
  )
}
