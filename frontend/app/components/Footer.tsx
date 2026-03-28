import { FaInstagram, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import Link from 'next/link'

const INSTAGRAM_URL = 'https://www.instagram.com/sportcore.kg'

const instaPhotos = [
  '/insta1.webp',
  '/insta2.webp',
  '/insta3.webp',
  '/insta4.webp',
]

export default function Footer() {
  return (
    <footer className="bg-[#1a1f4b] text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Колонка 1: Инстаграм с фото */}
        <div>
          <h3 className="font-semibold text-2xl mb-4">Наш Инстаграм</h3>

          {/* Вся сетка кликабельна и при наводке темнеет + иконка */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block group w-40"
          >
            {/* Сетка 2x2 */}
            <div className="grid grid-cols-2 gap-2">
              {instaPhotos.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={src}
                    alt={`Instagram ${i + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                  />
                </div>
              ))}
            </div>

            {/* Иконка инсты поверх всей сетки при наводке */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaInstagram className="text-white text-5xl drop-shadow-lg" />
            </div>
          </a>
        </div>

        {/* Колонка 2: навигация */}
        <div>
          <h3 className="font-semibold text-2xl mb-4">Быстрая навигация</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-yellow-400">Главная</Link></li>
            <li><Link href="/category" className="hover:text-yellow-400">Категории</Link></li>
            <li><Link href="/faq" className="hover:text-yellow-400">Часто задаваемые вопросы</Link></li>
            <li><Link href="/cart" className="hover:text-yellow-400">Корзина</Link></li>
          </ul>
        </div>

        {/* Колонка 3: контакты */}
        <div>
          <h3 className="font-semibold text-2xl mb-4">Контакты</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaPhone /> +996 774 23 12 02
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> г. Бишкек, проспект Чынгыза Айтматова 299в, ТРЦ Ала-Арча 2 этаж
            </li>
          </ul>
        </div>

      </div>
    </footer>
  )
}