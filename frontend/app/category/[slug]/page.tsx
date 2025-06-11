// frontend/app/category/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import { getProductsByCategory, Product } from '../../../lib/api'
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

  const filters = {
    category: slug, // фильтруем по текущему слагу
    price: typeof searchParams.price === 'string' ? searchParams.price : undefined,
  }

  const products = await getProductsByCategory(slug, { price: filters.price })


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
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.imageUrl}
            />
          ))}
        </div>
      )}
    </main>
  )
}
