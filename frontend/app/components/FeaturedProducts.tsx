// frontend/app/components/FeaturedProducts.tsx
import ProductCard from './ProductCard'
import { getFeaturedProducts } from '../../lib/api'

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts()

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1f4b]">Хиты продаж</h2>
        <a
          href="/category"
          className="bg-yellow-400 text-[#1a1f4b] px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Смотреть все товары
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
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
