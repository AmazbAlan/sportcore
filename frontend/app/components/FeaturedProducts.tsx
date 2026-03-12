// frontend/app/components/FeaturedProducts.tsx
import ProductCard from './ProductCard'
import { getFeaturedProducts } from '../../lib/api'
import Link from 'next/link'

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts()

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1f4b]">
          Хиты продаж
        </h2>

        <Link
          href="/category"
          className="bg-yellow-400 text-[#1a1f4b] px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Смотреть все товары
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {featured.map((product) => (
          <ProductCard
            key={product.slug}   // исправлено
            slug={product.slug}
            title={product.title}
            price={product.price}
            image={product.imageUrl}
          />
        ))}
      </div>
    </section>
  )
}