// frontend/app/product/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import type { Metadata } from 'next'
import { getProductBySlug } from '../../../lib/api'
import CartControls from './CartControls'
import ProductInfoCard from './ProductInfoCard'

type ProductPageProps = {
  params: { slug: string }
}

function extractText(desc: any[] = []): string {
  return desc
    .map((block: any) => (block?.children ?? []).map((c: any) => c?.text ?? '').join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Товар не найден — Sportcore',
      description: 'Товар отсутствует или был удалён из каталога.',
      robots: { index: false, follow: false },
    }
  }

  const desc = extractText(Array.isArray(product.description) ? product.description : []).slice(0, 200)

  return {
    title: `${product.title} — купить в Бишкеке | Sportcore`,
    description:
      desc ||
      `Купить ${product.title} в Бишкеке. Описание, характеристики, фото. Быстрая доставка по городу.`,
    openGraph: {
      title: `${product.title} — Sportcore`,
      description: desc,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return <p className="p-4">Товар не найден.</p>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Общая сетка: слева единая карточка товара (фото+описание), справа покупка */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Слева: единый красивый блок */}
        <ProductInfoCard product={product} />

        {/* Справа: название, цена, параметры/кнопка */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-[#1a1f4b]">{product.title}</h1>

          <p className="text-2xl font-semibold text-gray-800">
            {Number(product.price).toLocaleString()} сом
          </p>

          <CartControls product={product} />
        </div>
      </div>
    </main>
  )
}