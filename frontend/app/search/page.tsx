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
      title: 'Поиск товаров — SPORTCORE Бишкек',
      description: 'Введите поисковый запрос, чтобы найти товары в магазине SPORTCORE.',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `Поиск: «${query}» — SPORTCORE Бишкек`,
    description: `Результаты поиска по запросу «${query}» в магазине спортивных товаров SPORTCORE, Бишкек.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `Поиск: «${query}» — SPORTCORE`,
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
            href="/category"
            className="mt-6 px-6 py-3 bg-yellow-400 text-[#1a1f4b] rounded-xl font-semibold
                       hover:bg-yellow-300 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((prod) => (
            <Link
              key={prod.id}
              href={`/product/${prod.slug}`}
              className="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48 w-full bg-gray-50 overflow-hidden">
                <Image
                  src={prod.imageUrl && prod.imageUrl.length > 5 ? prod.imageUrl : '/placeholder.png'}
                  alt={`${prod.title} — купить в SPORTCORE Бишкек`}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-3 sm:p-4">
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 leading-snug mb-2">
                  {prod.title}
                </h2>
                <p className="font-black text-[#1a1f4b] text-base">
                  {Number(prod.price).toLocaleString()}{' '}
                  <span className="text-xs font-medium text-gray-400">сом</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}