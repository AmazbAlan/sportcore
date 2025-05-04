import { FaInstagram,  FaFacebook, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1f4b] text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        {/* Колонка 1: соцсети */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Наши страницы</h3>
          <div className="flex gap-4 text-2xl">
            <a href="#" aria-label="Instagram" className="hover:text-yellow-400">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-yellow-400">
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Колонка 2: навигация */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Быстрая навигация</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-yellow-400">Главная</Link></li>
            <li><Link href="/about" className="hover:text-yellow-400">О нас</Link></li>
            <li><Link href="/jobs" className="hover:text-yellow-400">Вакансии</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-400">Контакты</Link></li>
            <li><Link href="/cart" className="hover:text-yellow-400">Корзина</Link></li>
          </ul>
        </div>

        {/* Колонка 3: контакты */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Контакты</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> Бишкек, ул. Чокморова 24/3</li>
            <li className="flex items-center gap-2"><FaPhone /> +996 777 77 77 77</li>
            <li className="flex items-center gap-2"><FaEnvelope /> sportcore@gmail.com</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
