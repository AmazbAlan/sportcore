// frontend/app/search/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { searchProducts, Product } from '../../lib/api'
import type { Metadata } from 'next'

interface SearchPageProps {
  searchParams: { query?: string }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.query?.trim() || ''

  if (!query) {
    return {
      title: 'Поиск товаров — SPORTCORE | Спорткор | Спорт кор',
      description:
        'Введите поисковый запрос, чтобы найти товары в магазине SPORTCORE | Спорткор | Спорт кор.',
    }
  }

  return {
    title: `Поиск: «${query}» — SPORTCORE | Спорткор | Спорт кор`,
    description: `Результаты поиска по запросу «${query}». Найдите нужные товары в интернет-магазине SPORTCORE | Спорткор | Спорт кор.`,
    openGraph: {
      title: `Поиск: «${query}» — SPORTCORE | Спорткор | Спорт кор`,
      description: `Результаты поиска по запросу «${query}».`,
    },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query?.trim() || ''

  if (!query) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-700">Введите запрос для поиска товаров.</p>
      </main>
    )
  }

  const products: Product[] = await searchProducts(query)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Результаты поиска: «{query}»</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 animate-fadeIn">
          <div className="relative w-64 h-64 mb-6">
            <Image
              src="/empty-search.png" // положи картинку в /public/empty-search.png
              alt="Ничего не найдено"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">Ничего не найдено</h2>

          <p className="mt-2 text-gray-600 max-w-md">
            По запросу «{query}» товары не найдены. Попробуйте изменить запрос или вернитесь в
            каталог.
          </p>

          <Link
            href="/catalog"
            className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium
                       hover:brightness-95 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <Link
              key={prod.id}
              href={`/product/${prod.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
            >
              <div className="relative h-48 w-full bg-gray-50">
                <Image
                  src={prod.imageUrl && prod.imageUrl.length > 5 ? prod.imageUrl : '/placeholder.png'}
                  alt={prod.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-4">
                <h2 className="font-medium text-gray-900 line-clamp-2">{prod.title}</h2>
                <p className="mt-2 font-bold text-gray-900">
                  {Number(prod.price).toLocaleString()} сом
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}