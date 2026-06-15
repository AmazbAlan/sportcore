'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa'
import { useCart } from '../context/CartContext'

const navLinks = [
  { href: '/',         label: 'Главная' },
  { href: '/category', label: 'Каталог' },
  { href: '/faq',      label: 'FAQ' },
]

export default function Header() {
  const [searchTerm, setSearchTerm]       = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const router   = useRouter()
  const pathname = usePathname()
  const { items } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (q) {
      router.push(`/search?query=${encodeURIComponent(q)}`)
      setMobileSearchOpen(false)
    }
  }

  return (
    <header className="bg-[#1a1f4b] text-white shadow-lg sticky top-0 z-50">
      {/* Основная строка */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Логотип */}
        <Link href="/" className="text-xl font-extrabold tracking-tight flex items-center gap-2 shrink-0 hover:text-yellow-400 transition-colors">
          SPORTCORE
        </Link>

        {/* Поиск на десктопе */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="flex items-center bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-3 py-2 w-full transition-colors focus-within:bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-yellow-400 group">
            <input
              type="text"
              placeholder="Поиск товаров или брендов..."
              className="flex-1 text-white group-focus-within:text-gray-900 bg-transparent outline-none text-sm placeholder:text-white/60 group-focus-within:placeholder:text-gray-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="pl-2 p-1.5 rounded-lg text-white/70 group-focus-within:text-gray-500 hover:text-white transition-colors">
              <FaSearch className="text-sm" />
            </button>
          </div>
        </form>

        {/* Иконки */}
        <div className="flex items-center gap-2">
          {/* Поиск — мобильные */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Поиск"
          >
            <FaSearch className="text-lg" />
          </button>

          {/* Корзина */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors group"
            aria-label="Корзина"
          >
            <div className="relative">
              <FaShoppingCart className="text-xl group-hover:text-yellow-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#1a1f4b] text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-0.5">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-medium group-hover:text-yellow-400 transition-colors">
              Корзина
            </span>
          </Link>

          {/* Бургер — мобильные */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <div className="w-5 h-5 relative">
              <FaBars
                className={`absolute inset-0 text-lg transition-all duration-200 ${
                  mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <FaTimes
                className={`absolute inset-0 text-lg transition-all duration-200 ${
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Мобильный поиск — оверлей */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#1a1f4b] flex flex-col px-4 py-6 animate-slideDown">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Поиск</h2>
            <button onClick={() => setMobileSearchOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-white rounded-xl px-4 py-3 gap-2">
              <FaSearch className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Поиск товаров или брендов..."
                className="flex-1 text-gray-900 outline-none text-base"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-yellow-400 text-[#1a1f4b] font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Найти
            </button>
          </form>
        </div>
      )}

      {/* Мобильное меню — анимированное */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-[#121636] px-3 py-2 space-y-0.5">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-[#1a1f4b] text-yellow-400'
                  : 'text-gray-300 hover:bg-[#1a1f4b] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://api.whatsapp.com/send?phone=+996774231202&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-[#1a1f4b] hover:text-green-400 transition-colors"
          >
            Связаться с нами
          </a>
        </nav>
      </div>

      {/* Десктопная навигация */}
      <nav className="bg-[#121636] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-yellow-400 rounded-full" />
              )}
            </Link>
          ))}
          <a
            href="https://api.whatsapp.com/send?phone=+996774231202&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-green-400 transition-colors ml-auto"
          >
            Связаться с нами
          </a>
        </div>
      </nav>
    </header>
  )
}
