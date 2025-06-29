'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaShoppingCart,
  FaSearch,
  FaPhoneAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (q) {
      router.push(`/search?query=${encodeURIComponent(q)}`)
      setMobileSearchOpen(false)
    }
  }

  return (
    <header className="bg-[#1a1f4b] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          SPORTCORE
        </Link>

        {/* Поиск — только на ноутбуках */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl"
        >
          <div className="flex items-center bg-white rounded-md px-3 py-2 w-full">
            <input
              type="text"
              placeholder="Поиск товаров или брендов..."
              className="flex-1 text-black outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="pl-2 p-2 rounded transition-all duration-200 transform hover:bg-gray-200 hover:scale-110"
            >
              <FaSearch className="text-gray-600" />
            </button>
          </div>
        </form>

        {/* Иконки */}
        <div className="flex items-center gap-4">
          {/* Поиск — только на мобильных */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden"
          >
            <FaSearch className="text-xl" />
          </button>

          {/* Корзина */}
          <Link
            href="/cart"
            className="flex items-center gap-1 transition-transform duration-200 hover:scale-110 hover:text-yellow-400"
          >
            <FaShoppingCart className="text-2xl" />
            <span className="hidden md:inline">Корзина</span>
          </Link>

          {/* Бургер-меню — только на мобильных */}
          <button
            className="md:hidden text-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Полноэкранный поиск для мобилки */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#1a1f4b] flex flex-col px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Поиск</h2>
            <button onClick={() => setMobileSearchOpen(false)}>
              <FaTimes className="text-xl" />
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <input
                type="text"
                placeholder="Поиск товаров или брендов..."
                className="flex-1 text-black outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="pl-2 p-2 rounded transition-all duration-200 transform hover:bg-gray-200 hover:scale-110"
              >
                <FaSearch className="text-gray-600" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121636] text-white px-4 py-4 space-y-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-400">
            Главная
          </Link>
          <Link href="/category" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-400">
            Категории
          </Link>
          <a
            href="https://api.whatsapp.com/send?phone=+996708201663&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-green-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            Связаться с нами
          </a>
        </div>
      )}

      {/* Навигация — только на ноутбуках */}
      <nav className="bg-[#121636] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-8">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-200 transition-colors duration-200 hover:text-blue-400"
          >
            Главная
          </Link>
          <Link
            href="/category"
            className="text-lg font-semibold text-gray-200 transition-colors duration-200 hover:text-blue-400"
          >
            Категории
          </Link>
          <a
            href="https://api.whatsapp.com/send?phone=+996708201663&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-200 transition-colors duration-200 hover:text-green-400"
          >
            Связаться с нами
          </a>
        </div>
      </nav>
    </header>
  )
}
