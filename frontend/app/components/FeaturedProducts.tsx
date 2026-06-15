import ProductCard from './ProductCard'
import AnimatedCard from './AnimatedCard'
import { getFeaturedProducts } from '../../lib/api'
import Link from 'next/link'

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts()

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      {/* Заголовок секции */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1a1f4b] tracking-tight">
            Хиты продаж
          </h2>
          <p className="text-gray-500 text-sm mt-1">Самые популярные товары этой недели</p>
        </div>
        <Link
          href="/category"
          className="shrink-0 inline-flex items-center gap-1.5 bg-yellow-400 text-[#1a1f4b] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors shadow-sm"
        >
          Все товары
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* MOBILE — горизонтальный скролл */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory md:hidden pb-3 -mx-4 px-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {featured.map((product) => (
          <div key={product.slug} className="min-w-[44%] max-w-[180px] snap-start shrink-0">
            <ProductCard
              slug={product.slug}
              title={product.title}
              price={product.price}
              image={product.imageUrl}
              featured={product.featured}
            />
          </div>
        ))}
      </div>

      {/* DESKTOP — сетка с анимацией */}
      <div className="hidden md:grid md:grid-cols-4 gap-6">
        {featured.map((product, i) => (
          <AnimatedCard key={product.slug} delay={i * 0.08}>
            <ProductCard
              slug={product.slug}
              title={product.title}
              price={product.price}
              image={product.imageUrl}
              featured={product.featured}
            />
          </AnimatedCard>
        ))}
      </div>
    </section>
  )
}