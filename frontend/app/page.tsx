import HeroBanner from './components/HeroBanner'
import FeaturedProducts from './components/FeaturedProducts'
import CategoryGrid from './components/CategoryGrid'
import NewestArrivals from './components/NewestArrivals'

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
