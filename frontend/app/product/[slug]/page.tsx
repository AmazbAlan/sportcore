export const revalidate = 3600

import React from 'react'
import type { Metadata } from 'next'
import { getProductBySlug, getAllCategories } from '../../../lib/api'
import CartControls from './CartControls'
import ProductInfoCard from './ProductInfoCard'

type Props = { params: { slug: string } }

function extractText(desc: any[] = []): string {
  return desc
    .map((block: any) => (block?.children ?? []).map((c: any) => c?.text ?? '').join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Товар не найден',
      robots: { index: false, follow: false },
    }
  }

  const desc = extractText(Array.isArray(product.description) ? product.description : []).slice(0, 200)
  const url = `https://sportcore.kg/product/${product.slug}`

  const seoTitle =
    product.seo_title?.trim() ||
    `${product.title} — купить в Бишкеке | SPORTCORE`

  const seoDescription =
    product.seo_desc?.trim() ||
    desc ||
    `Купить ${product.title} в Бишкеке по лучшей цене. ${Number(product.price).toLocaleString()} сом. Быстрая доставка по Кыргызстану. SPORTCORE.`

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      type: 'product',
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h1>
        <a href="/category" className="text-blue-600 hover:underline">Вернуться в каталог</a>
      </main>
    )
  }

  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === product.categorySlug)
  const categoryName = category?.name || product.categorySlug

  const desc = extractText(Array.isArray(product.description) ? product.description : []).slice(0, 300)
  const inStock = (product.variants ?? []).some((v) => Number(v.stock ?? 0) > 0)
  const productUrl = `https://sportcore.kg/product/${product.slug}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.seo_desc?.trim() || desc || product.title,
    image: product.imageUrl ? [product.imageUrl] : [],
    sku: product.slug,
    url: productUrl,
    brand: { '@type': 'Brand', name: 'SPORTCORE' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'KGS',
      price: String(product.price),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'SPORTCORE' },
      areaServed: { '@type': 'Country', name: 'KG' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://sportcore.kg' },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://sportcore.kg/category' },
      ...(product.categorySlug
        ? [{ '@type': 'ListItem', position: 3, name: categoryName, item: `https://sportcore.kg/category/${product.categorySlug}` }]
        : []),
      { '@type': 'ListItem', position: product.categorySlug ? 4 : 3, name: product.title, item: productUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="container mx-auto px-4 py-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-gray-500 mb-6 flex gap-1 items-center flex-wrap">
          <a href="/" className="hover:text-gray-700">Главная</a>
          <span>/</span>
          <a href="/category" className="hover:text-gray-700">Каталог</a>
          {product.categorySlug && (
            <>
              <span>/</span>
              <a href={`/category/${product.categorySlug}`} className="hover:text-gray-700">{categoryName}</a>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductInfoCard product={product} />
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
