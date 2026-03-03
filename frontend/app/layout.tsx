// app/layout.tsx
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://sportcore.kg'),
  title: {
    default: 'Sportcore — спортивные товары в Бишкеке',
    template: '%s — Sportcore',
  },
  description:
    'Интернет-магазин спортивных товаров в Бишкеке. Одежда, обувь, инвентарь.',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-white text-gray-900">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
