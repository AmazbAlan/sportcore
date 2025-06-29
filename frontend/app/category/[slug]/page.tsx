export const dynamic = 'force-dynamic'

import React from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryFilter from '../../components/CategoryFilter'
import { getProductsByCategory } from '../../../lib/api'

// типизируем как async component с params и searchParams
type Props = {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const slug = params.slug

  const rawPrice  = Array.isArray(searchParams?.price)  ? searchParams?.price[0]  : searchParams?.price
  const rawSearch = Array.isArray(searchParams?.search) ? searchParams?.search[0] : searchParams?.search

  const maxPrice = rawPrice  ? Number(rawPrice) : undefined
  const search   = rawSearch ? rawSearch.toLowerCase() : undefined

  const productsByCategory = await getProductsByCategory(slug, maxPrice)

  const products = search
    ? productsByCategory.filter((p) =>
        p.title.toLowerCase().includes(search)
      )
    : productsByCategory

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold capitalize">
        {decodeURIComponent(slug)}
      </h1>

      <CategoryFilter categorySlug={slug} />

      {products.length === 0 ? (
        <p className="text-gray-500">
          Товары в этой категории пока отсутствуют.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              title={p.title}
              price={p.price}
              image={p.imageUrl}
            />
          ))}
        </div>
      )}
    </main>
  )
}
