'use client'

import Link from 'next/link'
import { FaHeart, FaShoppingBasket, FaSearch } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="bg-[#1a1f4b] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          {/* <img src="/logo.svg" alt="Sportcore" className="h-8" /> */}
          SPORTCORE
        </Link>

        {/* Поиск */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center bg-white rounded-md px-3 py-2">
          <input
                type="text"
                placeholder="Поиск товаров или брендов..."
                className="flex-1 text-black outline-none"
              />
            <FaSearch className="text-gray-600" />
          </div>
        </div>

        {/* Иконки */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/cart" className="flex items-center gap-1 hover:text-yellow-400">
            <FaShoppingBasket /> Корзина
          </Link>
        </div>
      </div>

      {/* Навигация */}
      <nav className="bg-[#121636] text-sm text-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6">
          <Link href="/" className="hover:text-white font-semibold">Главная</Link>
          <Link href="/category" className="hover:text-white font-semibold">Категории</Link>
          <Link href="/about" className="hover:text-white">О нас</Link>
          <Link href="/jobs" className="hover:text-white">Вакансии</Link>
          <Link href="/contact" className="hover:text-white">Контакты</Link>
        </div>
      </nav>
    </header>
  )
}
