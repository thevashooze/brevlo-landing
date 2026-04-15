import './globals.css'

export const metadata = {
  title: 'Brevlo | Beyond Visuals — YouTube Thumbnail Agency',
  description: 'Brevlo is a data-driven thumbnail agency built for creators who take growth seriously. We study what makes viewers click — psychology, color theory, composition, and CTR science.',
  keywords: [
    'YouTube thumbnail agency',
    'thumbnail design service',
    'CTR optimization',
    'YouTube growth',
    'custom thumbnails',
    'thumbnail designer',
    'Brevlo',
    'brevlomedia',
    'beyond visuals',
    'data-driven thumbnails',
    'YouTube creator tools',
  ],
  metadataBase: new URL('https://www.brevlomedia.com'),
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Brevlo Media', url: 'https://www.brevlomedia.com' }],
  creator: 'Brevlo Media',
  publisher: 'Brevlo Media',
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
    title: 'Brevlo | Beyond Visuals — YouTube Thumbnail Agency',
    description: 'Brevlo is a data-driven thumbnail agency built for creators who take growth seriously. We study what makes viewers click — psychology, color theory, composition, and CTR science.',
    images: [
      {
        url: '/logo.png',
        width: 1080,
        height: 1080,
        alt: 'Brevlo Media Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brevlo | Beyond Visuals — YouTube Thumbnail Agency',
    description: 'Data-driven thumbnails engineered for maximum CTR. Built for serious YouTube creators.',
    images: ['/logo.png'],
    creator: '@brevlomedia',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
  },
  verification: {
    google: '',
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
  description: 'Data-driven thumbnail agency for YouTube creators.',
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
