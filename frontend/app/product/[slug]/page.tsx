// frontend/app/product/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import { getProductBySlug, Product } from '../../../lib/api'
import CartControls from './CartControls'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: 'Товар не найден — Sportcore' }
  }

  // Собираем текст описания в одну строку для метаданных
  const desc = product.description
    .map((block) => block.children.map((c) => c.text).join(''))
    .join('\n\n')

  return {
    title: product.title,
    description: desc,
    openGraph: {
      title: product.title,
      description: desc,
      images: [product.imageUrl],
    },
  }
}

export default async function ProductPage(
  { params }: ProductPageProps
) {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return <p className="p-4">Товар не найден.</p>
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Изображение + основной заголовок/цена */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 h-96">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold">
            {product.price.toLocaleString()} сом
          </p>
        </div>
      </div>

      {/* Описание из Strapi (Rich Text) */}
      <section className="prose max-w-none">
        {product.description.map((block, i) => {
          const txt = block.children.map((c) => c.text).join('')
          return <p key={i}>{txt}</p>
        })}
      </section>

      {/* Блок управления количеством и «В корзину» */}
      <CartControls product={product} />
    </main>
  )
}
