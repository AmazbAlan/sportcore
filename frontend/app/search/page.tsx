// frontend/app/search/page.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// заменили getProductsBySearch на searchProducts
import { searchProducts, Product } from '../../lib/api'

interface SearchPageProps {
  searchParams: { query?: string }
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query?.trim() || ''

  if (!query) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center">Введите запрос для поиска товаров.</p>
      </main>
    )
  }

  // теперь вызываем правильную функцию
  const products: Product[] = await searchProducts(query)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Результаты поиска: «{query}»
      </h1>

      {products.length === 0 ? (
        <p>По запросу «{query}» товары не найдены.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <Link
              key={prod.id}
              href={`/product/${prod.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={prod.imageUrl}
                  alt={prod.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h2 className="font-medium">{prod.title}</h2>
                <p className="mt-2 font-bold">{prod.price} сом</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
