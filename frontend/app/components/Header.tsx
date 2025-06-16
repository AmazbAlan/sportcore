'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaShoppingCart, FaSearch, FaPhoneAlt } from 'react-icons/fa'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (q) {
      router.push(`/search?query=${encodeURIComponent(q)}`)
    }
  }

  return (
    <header className="bg-[#1a1f4b] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          SPORTCORE
        </Link>

        {/* Форма поиска */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="flex items-center bg-white rounded-md px-3 py-2">
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

        {/* Контакты и корзина */}
        <div className="flex items-center gap-6 text-base">
          {/* WhatsApp */}
          <a
            href="https://api.whatsapp.com/send?phone=+996708201663&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-transform duration-200 hover:scale-110 hover:text-green-400"
          >
            <FaPhoneAlt className="text-2xl transform scale-x-[1]" />
            <span> Контакты</span>
          </a>

          {/* Корзина */}
          <Link
            href="/cart"
            className="flex items-center gap-1 transition-transform duration-200 hover:scale-110 hover:text-yellow-400"
          >
            <FaShoppingCart className="text-2xl" />
            Корзина
          </Link>
        </div>
      </div>

      {/* Нижняя навигация */}
      <nav className="bg-[#121636]">
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
        </div>
      </nav>
    </header>
)
}
