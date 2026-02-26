// frontend/app/product/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getProductBySlug } from '../../../lib/api'
import CartControls from './CartControls'

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

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Товар не найден — Sportcore',
      description: 'Товар отсутствует или был удалён из каталога.',
      robots: { index: false, follow: false },
    }
  }

  const desc = extractText(product.description).slice(0, 200)

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

  const descriptionTextBlocks =
    Array.isArray(product.description) ? product.description : []

  // fallback если imageUrl пустой/битый
  const mainImageSrc = product.imageUrl && product.imageUrl.length > 5
    ? product.imageUrl
    : '/placeholder.jpg'

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая часть */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full max-w-[400px] aspect-square bg-white rounded shadow mx-auto">
            <Image
              src={mainImageSrc}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-4"
              priority
            />
          </div>

          {/* Описание */}
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            {descriptionTextBlocks.map((block, i) => {
              const text = (block?.children ?? []).map((c: any) => c?.text ?? '').join(' ')
              return text ? <p key={i}>{text}</p> : null
            })}
          </div>
        </div>

        {/* Правая часть */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
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