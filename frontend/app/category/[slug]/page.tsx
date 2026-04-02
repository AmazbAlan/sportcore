import type { Metadata } from 'next'
import { getProductsByCategory, getAllCategories } from '../../../lib/api'
import ProductCard from '../../components/ProductCard'
import CategoryFilter from '../../components/CategoryFilter'

export const revalidate = 3600

type Props = {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === params.slug)
  const name = category?.name || decodeURIComponent(params.slug)
  const url = `https://sportcore.kg/category/${params.slug}`

  return {
    title: `${name} — купить в Бишкеке`,
    description: `Купить ${name.toLowerCase()} в магазине SPORTCORE в Бишкеке. Большой выбор, лучшие цены, быстрая доставка по Кыргызстану.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${name} — SPORTCORE Бишкек`,
      description: `Купить ${name.toLowerCase()} в Бишкеке. Доставка по Кыргызстану.`,
      url,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const slug = params.slug
  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)
  const categoryName = category?.name || decodeURIComponent(slug)

  const rawMax = Array.isArray(searchParams?.max) ? searchParams?.max[0] : searchParams?.max
  const rawSearch = Array.isArray(searchParams?.search) ? searchParams?.search[0] : searchParams?.search
  const rawMin = Array.isArray(searchParams?.min) ? searchParams?.min[0] : searchParams?.min

  const minPrice = rawMin ? Number(rawMin) : undefined
  const maxPrice = rawMax ? Number(rawMax) : undefined
  const search = rawSearch ? rawSearch.toLowerCase() : undefined

  let products = await getProductsByCategory(slug)

  if (search) products = products.filter((p) => p.title.toLowerCase().includes(search))
  if (minPrice !== undefined) products = products.filter((p) => p.price >= minPrice)
  if (maxPrice !== undefined) products = products.filter((p) => p.price <= maxPrice)

  const categoryUrl = `https://sportcore.kg/category/${slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://sportcore.kg' },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://sportcore.kg/category' },
      { '@type': 'ListItem', position: 3, name: categoryName, item: categoryUrl },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} — SPORTCORE`,
    url: categoryUrl,
    numberOfItems: products.length,
    breadcrumb: breadcrumbSchema,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <nav aria-label="Хлебные крошки" className="text-sm text-gray-500 mb-4 flex gap-1 items-center">
          <a href="/" className="hover:text-gray-700">Главная</a>
          <span>/</span>
          <a href="/category" className="hover:text-gray-700">Каталог</a>
          <span>/</span>
          <span className="text-gray-800">{categoryName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1f2937] mb-8">{categoryName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <CategoryFilter categorySlug={slug} />
          <div>
            {products.length === 0 ? (
              <p className="text-gray-500">Товары в этой категории пока отсутствуют.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    slug={p.slug}
                    title={p.title}
                    price={p.price}
                    image={p.imageUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
