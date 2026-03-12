import HeroBanner from './components/HeroBanner'
import FeaturedProducts from './components/FeaturedProducts'
import CategoryGrid from './components/CategoryGrid'



export const metadata = {
  title: 'SPORTCORE — магазин спортивных товаров | СПОРТКОР | Спорт кор',
  description: 'Спортивные товары для тренировок, спорта и активной жизни. Магазин SPORTCORE в Бишкеке.',
  keywords: ['спорт', 'спорт товары', 'экипировка', 'фитнес', 'магазин спорта', 'СПОРТКОР',' Спорт кор', 'купить спорт товары'],
  openGraph: {
    title: 'SPORTCORE — спортивный магазин | СПОРТКОР | Спорт кор',
    description: 'Большой выбор спортивных товаров, обуви и инвентаря.',
    url: 'https://sportcore.kg',
    siteName: 'SPORTCORE | СПОРТКОР | Спорт кор',
    locale: 'ru_RU',
    type: 'website',
  },
}



export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FeaturedProducts />
      <CategoryGrid />
    </main>
  )
}


export const dynamic = 'force-dynamic';
