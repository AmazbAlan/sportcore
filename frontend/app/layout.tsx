import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import ChatWidget from './components/ChatWidget'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

const BASE_URL = 'https://sportcore.kg'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SPORTCORE — спортивные товары в Бишкеке | Спорткор',
    template: '%s | SPORTCORE Бишкек',
  },
  description:
    'Интернет-магазин спортивных товаров SPORTCORE в Бишкеке. Одежда, обувь, инвентарь, аксессуары для спорта и фитнеса. Доставка по Кыргызстану.',
  keywords: [
    'спортивные товары Бишкек',
    'купить спорт товары',
    'спортмагазин Бишкек',
    'SPORTCORE',
    'Спорткор',
    'фитнес товары',
    'спортивная одежда',
    'спортивная обувь',
    'инвентарь для спорта',
  ],
  authors: [{ name: 'SPORTCORE', url: BASE_URL }],
  creator: 'SPORTCORE',
  publisher: 'SPORTCORE',
  formatDetection: { telephone: true, email: false, address: true },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: BASE_URL,
    siteName: 'SPORTCORE',
    title: 'SPORTCORE — спортивные товары в Бишкеке',
    description:
      'Большой выбор спортивных товаров, одежды, обуви и инвентаря. Быстрая доставка по Бишкеку и Кыргызстану.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SPORTCORE — спортивный магазин в Бишкеке',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPORTCORE — спортивные товары в Бишкеке',
    description: 'Большой выбор спортивных товаров. Быстрая доставка по Кыргызстану.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google5bad66ecfeaef106',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportingGoodsStore',
  name: 'SPORTCORE',
  alternateName: ['Спорткор', 'Спорт кор'],
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  image: `${BASE_URL}/og-image.jpg`,
  description:
    'Интернет-магазин спортивных товаров в Бишкеке. Одежда, обувь, инвентарь для спорта и фитнеса.',
  telephone: '+996774231202',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'проспект Чынгыза Айтматова 299в, ТРЦ Ала-Арча, 2 этаж',
    addressLocality: 'Бишкек',
    addressCountry: 'KG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '42.8746',
    longitude: '74.5698',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  sameAs: ['https://www.instagram.com/sportcore.kg'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+996774231202',
    contactType: 'customer service',
    availableLanguage: ['Russian', 'Kyrgyz'],
  },
  priceRange: '$$',
  currenciesAccepted: 'KGS',
  paymentAccepted: 'Cash, Credit Card',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SPORTCORE',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?query={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-white text-gray-900">
        <CartProvider>
          <Header />
          {children}
          <ChatWidget />
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
