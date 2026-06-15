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
    <footer className="bg-[#1a1f4b] text-white pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-white/10">

        {/* Колонка 1: Инстаграм с фото */}
        <div>
          <h3 className="font-bold text-xl mb-4">Наш Инстаграм</h3>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block group w-44 sm:w-40"
          >
            {/* Сетка 2x2 */}
            <div className="grid grid-cols-2 gap-2">
              {instaPhotos.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={src}
                    alt={`SPORTCORE в Instagram — фото из магазина спортивных товаров в Бишкеке ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaInstagram className="text-white text-5xl drop-shadow-lg" />
            </div>
          </a>

          <p className="mt-3 text-sm text-white/60">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              @sportcore.kg
            </a>
          </p>
        </div>

        {/* Колонка 2: навигация */}
        <div>
          <h3 className="font-bold text-xl mb-4">Быстрая навигация</h3>
          <ul className="space-y-2.5">
            {[
              { href: '/',         label: 'Главная' },
              { href: '/category', label: 'Каталог' },
              { href: '/faq',      label: 'Частые вопросы' },
              { href: '/cart',     label: 'Корзина' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-white/80 hover:text-yellow-400 transition-colors text-sm">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Колонка 3: контакты */}
        <div>
          <h3 className="font-bold text-xl mb-4">Контакты</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <a href="tel:+996774231202" className="flex items-start gap-2.5 hover:text-white transition-colors min-h-[44px]">
                <FaPhone className="mt-0.5 shrink-0" />
                <span>+996 774 23 12 02</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="mt-0.5 shrink-0" />
              <span>г. Бишкек, проспект Чынгыза Айтматова 299в, ТРЦ Ала-Арча, 2 этаж</span>
            </li>
            <li>
              <a
                href="https://api.whatsapp.com/send?phone=+996774231202"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
        <span>© {new Date().getFullYear()} SPORTCORE. Все права защищены.</span>
        <span>г. Бишкек, Кыргызстан</span>
      </div>
    </footer>
  )
}