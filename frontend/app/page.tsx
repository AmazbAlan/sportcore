import HeroBanner from './components/HeroBanner'
import FeaturedProducts from './components/FeaturedProducts'
import CategoryGrid from './components/CategoryGrid'
import NewestArrivals from './components/NewestArrivals'

export const metadata = {
  title: "Sportcore — спортивные товары в Бишкеке | Экипировка, одежда, аксессуары",
  description:
    "Sportcore — магазин спортивных товаров в Бишкеке. Гантели, мячи, перчатки, экипировка, фитнес-товары и аксессуары. Быстрая доставка по городу.",
  openGraph: {
    title: "Sportcore — спортивные товары в Бишкеке",
    description:
      "Интернет-магазин спортивных товаров: мячи, коврики для йоги, роллеры для спины, массажеры, гантели, фитнес-оборудование, аксессуары и многое другое. Доставка по Бишкеку.",
    url: "https://sportcore.kg",
    siteName: "Sportcore",
    locale: "ru_RU",
    type: "website",
  },
}


export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FeaturedProducts />
      <CategoryGrid />
      {/* <NewestArrivals /> */}
    </main>
  )
}
