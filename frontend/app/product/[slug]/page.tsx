export const revalidate = 60

import React from 'react'
import type { Metadata } from 'next'
import { getProductBySlug, getAllCategories } from '../../../lib/api'
import CartControls from './CartControls'
import ProductInfoCard from './ProductInfoCard'

type Props = { params: { slug: string } }

function extractText(desc: any): string {
  if (!desc) return ''
  if (typeof desc === 'string') return desc
  if (!Array.isArray(desc)) return ''
  try {
    return desc
      .map((block: any) => {
        if (!block) return ''
        if (typeof block === 'string') return block
        const children = Array.isArray(block.children) ? block.children : []
        return children.map((c: any) => (c && typeof c.text === 'string') ? c.text : '').join(' ')
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  } catch {
    return ''
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProductBySlug(params.slug)

    if (!product) {
      return {
        title: 'Товар не найден',
        robots: { index: false, follow: false },
      }
    }

    const desc = extractText(product.description).slice(0, 200)
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
        type: 'website',
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    }
  } catch (e) {
    return { title: 'SPORTCORE' }
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

  // Защитный блок — всё что ниже не должно падать никогда
  const categories = await getAllCategories().catch(() => [])
  const category = categories.find((c) => c.slug === product.categorySlug)
  const categoryName = category?.name || product.categorySlug || 'Каталог'

  const desc = extractText(product.description).slice(0, 300)
  const variants = Array.isArray(product.variants) ? product.variants : []
  const inStock = variants.some((v: any) => Number(v?.stock ?? 0) > 0) || Number((product as any).qty ?? 0) > 0
  const productUrl = `https://sportcore.kg/product/${product.slug}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title || 'Товар',
    description: product.seo_desc?.trim() || desc || product.title || '',
    image: product.imageUrl ? [product.imageUrl] : [],
    sku: product.slug,
    url: productUrl,
    brand: { '@type': 'Brand', name: 'SPORTCORE' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'KGS',
      price: String(product.price || 0),
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
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Хлебные крошки */}
        <nav aria-label="Хлебные крошки" className="text-xs text-gray-400 mb-6 flex gap-1.5 items-center flex-wrap">
          <a href="/" className="hover:text-[#1a1f4b] transition-colors">Главная</a>
          <span className="text-gray-300">/</span>
          <a href="/category" className="hover:text-[#1a1f4b] transition-colors">Каталог</a>
          {product.categorySlug && (
            <>
              <span className="text-gray-300">/</span>
              <a href={`/category/${product.categorySlug}`} className="hover:text-[#1a1f4b] transition-colors">{categoryName}</a>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 line-clamp-1 max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Фото + описание */}
          <ProductInfoCard product={product} />

          {/* Информация и покупка */}
          <div className="flex flex-col gap-5 md:sticky md:top-24 md:self-start">
            {/* Бейдж категории */}
            {categoryName && (
              <a
                href={`/category/${product.categorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a1f4b] bg-[#f0f2ff] px-3 py-1.5 rounded-full w-fit hover:bg-[#e0e4f8] transition-colors"
              >
                {categoryName}
              </a>
            )}

            {/* Заголовок */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1f4b] leading-snug">
              {product.title}
            </h1>

            {/* Цена */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1a1f4b]">
                {Number(product.price).toLocaleString()}
              </span>
              <span className="text-base font-medium text-gray-400">сом</span>
            </div>

            {/* Контролы корзины */}
            <CartControls product={product} />

            {/* Доп. информация */}
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Быстрая доставка по Бишкеку
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Возврат за 14 дней
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}