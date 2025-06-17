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

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return <p className="p-4">Товар не найден.</p>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая часть: изображение + описание */}
        <div className="w-full md:w-1/2">
          {/* Картинка */}
          <div className="relative w-full max-w-[400px] aspect-square bg-white rounded shadow mx-auto">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain p-4"
              priority
            />
          </div>


          {/* Описание */}
          <div className="ml-42 mt-6 space-y-2 text-sm text-gray-700">
            {product.description.map((block, i) => {
              const text = block.children.map((c) => c.text).join('')
              return <p key={i}>{text}</p>
            })}
          </div>
        </div>

        {/* Правая часть: название, цена и корзина */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-[#1a1f4b]">{product.title}</h1>
          <p className="text-2xl font-semibold text-gray-800">{product.price.toLocaleString()} сом</p>
          <CartControls product={product} />
        </div>
      </div>
    </main>
  )
}
