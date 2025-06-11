// frontend/app/category/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import React from 'react'
import {
  getProductsByCategory,
  getAllCategories,
  getProductBySlug,
  Product,
  Category,
} from '../../../lib/api'
import ProductCard from '../../../app/components/ProductCard'
import CategoryFilter from '../../../app/components/CategoryFilter'


interface CategoryPageProps {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const slug = params.slug

  // Извлекаем price из URL
  const rawPrice = Array.isArray(searchParams.price)
    ? searchParams.price[0]
    : searchParams.price

  const priceFilter = typeof rawPrice === 'string' ? rawPrice : undefined

  // Получаем продукты, передаём slug и фильтр по цене
  const products: Product[] = await getProductsByCategory(slug, {
    price: priceFilter,
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {decodeURIComponent(slug)}
      </h1>

      <CategoryFilter />

      {products.length === 0 ? (
        <p className="text-gray-500">
          Товары в этой категории пока отсутствуют.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block"
            >
              <ProductCard
                title={product.title}
                price={product.price}
                image={product.imageUrl}
              />
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
