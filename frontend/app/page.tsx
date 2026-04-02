import HeroBanner from './components/HeroBanner'
import FeaturedProducts from './components/FeaturedProducts'
import CategoryGrid from './components/CategoryGrid'
import Advantages from './components/Advantages'
import AboutUs from './components/AboutUs'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SPORTCORE — спортивные товары в Бишкеке | Спорткор',
  description:
    'Интернет-магазин спортивных товаров SPORTCORE в Бишкеке. Одежда, обувь, инвентарь и аксессуары для спорта и фитнеса. Доставка по всему Кыргызстану.',
  keywords: [
    'спортивные товары Бишкек',
    'купить спортивную одежду',
    'спортмагазин Кыргызстан',
    'SPORTCORE',
    'Спорткор',
    'спортивный инвентарь',
  ],
  alternates: {
    canonical: 'https://sportcore.kg',
  },
  openGraph: {
    title: 'SPORTCORE — спортивные товары в Бишкеке',
    description:
      'Большой выбор спортивных товаров, одежды и обуви. Быстрая доставка по Бишкеку и Кыргызстану.',
    url: 'https://sportcore.kg',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FeaturedProducts />
      <Advantages />
      <AboutUs />
      <CategoryGrid />
    </main>
  )
}
