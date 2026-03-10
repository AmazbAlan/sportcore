export const revalidate = 3600

import { getProductsByCategory, getAllCategories } from '../../../lib/api'
import ProductCard from '../../components/ProductCard'
import CategoryFilter from '../../components/CategoryFilter'

type Props = {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function CategoryPage({ params, searchParams }: Props) {

  const slug = params.slug

  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)

  const categoryName = category?.name || decodeURIComponent(slug)

  const rawMin = Array.isArray(searchParams?.min)
    ? searchParams?.min[0]
    : searchParams?.min

  const rawMax = Array.isArray(searchParams?.max)
    ? searchParams?.max[0]
    : searchParams?.max

  const rawSearch = Array.isArray(searchParams?.search)
    ? searchParams?.search[0]
    : searchParams?.search

  const minPrice = rawMin ? Number(rawMin) : undefined
  const maxPrice = rawMax ? Number(rawMax) : undefined
  const search = rawSearch ? rawSearch.toLowerCase() : undefined

  const productsByCategory = await getProductsByCategory(slug)

  let products = productsByCategory

  if (search) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(search)
    )
  }

  if (minPrice !== undefined) {
    products = products.filter((p) => p.price >= minPrice)
  }

  if (maxPrice !== undefined) {
    products = products.filter((p) => p.price <= maxPrice)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold text-[#1f2937] mb-8">
        {categoryName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">

        <CategoryFilter categorySlug={slug} />

        <div>

          {products.length === 0 ? (
            <p className="text-gray-500">
              Товары в этой категории пока отсутствуют.
            </p>
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
  )
}