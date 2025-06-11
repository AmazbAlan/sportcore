// frontend/app/product/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import { getProductBySlug, Product } from '../../../lib/api'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  return product
    ? { title: product.title, description: product.description.map((b) => b.children.map((c: any) => c.text).join(' ')).join('\n') }
    : { title: 'Товар не найден — Sportcore' }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product: Product | null = await getProductBySlug(params.slug)
  if (!product) return <p className="p-4">Товар не найден.</p>

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
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
          <p className="text-2xl font-semibold">{product.price} сом</p>
        </div>
      </div>

      {/* Здесь выводим описание из Strapi */}
      <section className="prose max-w-none">
        {product.description.map((block, i) => {
          const text = block.children.map((child: any) => child.text).join('')
          return <p key={i}>{text}</p>
        })}
      </section>

      <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg">
        В корзину
      </button>
    </main>
  )
}
