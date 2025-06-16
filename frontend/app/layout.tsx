// app/layout.tsx
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'

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
