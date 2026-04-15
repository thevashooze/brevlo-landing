import './globals.css'

export const metadata = {
  title: 'Brevlo | Beyond Visuals',
  description: 'Brevlo is a premium YouTube thumbnail agency. We design high-CTR thumbnails for creators across gaming, finance, history, and vlogs — same-day delivery, $20 flat.',
  keywords: [
    'YouTube thumbnail agency',
    'YouTube thumbnail design',
    'thumbnail design service',
    'high CTR thumbnails',
    'CTR optimization',
    'YouTube growth',
    'custom YouTube thumbnails',
    'thumbnail designer for YouTubers',
    'Brevlo',
    'brevlomedia',
    'beyond visuals',
    'YouTube creator tools',
    'same day thumbnail design',
    'professional thumbnail service',
    'YouTube thumbnail service',
  ],
  metadataBase: new URL('https://www.brevlomedia.com'),
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Brevlo', url: 'https://www.brevlomedia.com' }],
  creator: 'Brevlo',
  publisher: 'Brevlo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.brevlomedia.com',
    siteName: 'Brevlo',
    title: 'Brevlo | Beyond Visuals',
    description: 'Brevlo is a premium YouTube thumbnail agency. High-CTR thumbnails for creators — same-day delivery, $20 flat.',
    images: [
      {
        url: '/logo.png',
        width: 1080,
        height: 1080,
        alt: 'Brevlo — YouTube Thumbnail Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brevlo | Beyond Visuals',
    description: 'High-CTR thumbnails engineered for maximum clicks. Same-day delivery, $20 flat.',
    images: ['/logo.png'],
    creator: '@brevlomedia',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brevlo',
  url: 'https://www.brevlomedia.com',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Brevlo Media',
  alternateName: 'Brevlo',
  url: 'https://www.brevlomedia.com',
  logo: 'https://www.brevlomedia.com/logo.png',
  description: 'Data-driven YouTube thumbnail agency. We engineer clicks through psychology, color theory, and composition.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://www.brevlomedia.com',
  },
  offers: {
    '@type': 'Offer',
    description: 'Custom YouTube thumbnail design packages',
    url: 'https://www.brevlomedia.com/#pricing',
  },
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Brevlo | Beyond Visuals',
  description: 'Premium YouTube thumbnail agency. High-CTR thumbnails for creators — same-day delivery, $20 flat.',
  url: 'https://www.brevlomedia.com',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.brevlomedia.com',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
        <div className="fixed inset-0 pointer-events-none z-[-2] bg-live-gradient" />
        <div className="fixed inset-0 pointer-events-none z-[-1] grid-live-purple" />
        {children}
      </body>
    </html>
  )
}
