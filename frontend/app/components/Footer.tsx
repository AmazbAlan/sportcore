import { FaInstagram,  FaFacebook, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1f4b] text-white pb-18 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-l">
        {/* Колонка 1: соцсети */}
        <div>
          <h3 className="font-semibold text-2xl mb-4">Наши страницы</h3>
          <div className="flex gap-4 text-3xl">
            <a href="https://www.instagram.com/sportcore.kg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" className="hover:text-yellow-400">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Колонка 2: навигация */}
        <div>
          <h3 className="font-semibold text-2xl mb-4">Быстрая навигация</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-yellow-400">Главная</Link></li>
            <li><Link href="/category" className="hover:text-yellow-400">Категории</Link></li>
            <li><Link href="/cart" className="hover:text-yellow-400">Корзина</Link></li>
          </ul>
        </div>

        {/* Колонка 3: контакты */}
        <div>
          <h3 className="font-semibold text-2xl mb-4">Контакты</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> Бишкек, ул. Чокморова 24/3</li>
            <li className="flex items-center gap-2"><FaPhone /> +996 777 77 77 77</li>
            <li className="flex items-center gap-2"><FaEnvelope /> sportcore@gmail.com</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
