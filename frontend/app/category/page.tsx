import { getAllCategories } from '../../lib/api'
import CategoryPageClient from './CategoryPageClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Каталог спортивных товаров — SPORTCORE Бишкек',
  description:
    'Все категории спортивных товаров SPORTCORE: одежда, обувь, инвентарь, аксессуары, питание для спорта и фитнеса. Доставка по Кыргызстану.',
  alternates: {
    canonical: 'https://sportcore.kg/category',
  },
  openGraph: {
    title: 'Каталог спортивных товаров — SPORTCORE',
    description: 'Одежда, обувь, инвентарь и аксессуары для спорта. Лучшие цены в Бишкеке.',
    url: 'https://sportcore.kg/category',
    type: 'website',
  },
}

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Каталог спортивных товаров SPORTCORE',
  description: 'Все категории спортивных товаров в магазине SPORTCORE, Бишкек.',
  url: 'https://sportcore.kg/category',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://sportcore.kg' },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://sportcore.kg/category' },
    ],
  },
}

export default async function CategoryIndexPage() {
  const categories = await getAllCategories()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <CategoryPageClient categories={categories} />
    </>
  )
}
