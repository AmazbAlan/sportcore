// frontend/app/product/[slug]/page.tsx
export const revalidate = 3600

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
    alternates: { canonical: `https://sportcore.kg/product/${product.slug}` },
    title: `${product.title} — купить в Бишкеке | Sportcore`,
    description:
      desc ||
      `Купить ${product.title} в Бишкеке. Описание, характеристики, фото. Быстрая доставка по городу.`,
    openGraph: {
      url: `https://sportcore.kg/product/${product.slug}`,
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

const desc = extractText(Array.isArray(product.description) ? product.description : []).slice(0, 300)

const inStock = (product.variants ?? []).some(v => Number(v.stock ?? 0) > 0)

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  image: product.imageUrl ? [product.imageUrl] : [],
  description: desc || product.title,
  offers: {
    "@type": "Offer",
    url: `https://sportcore.kg/product/${product.slug}`,
    priceCurrency: "KGS",
    price: String(product.price),
    availability: inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
  },
}

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}