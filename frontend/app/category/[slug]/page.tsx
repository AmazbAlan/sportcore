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

  const rawPrice = Array.isArray(searchParams?.price)
    ? searchParams?.price[0]
    : searchParams?.price

  const rawSearch = Array.isArray(searchParams?.search)
    ? searchParams?.search[0]
    : searchParams?.search

  const maxPrice = rawPrice ? Number(rawPrice) : undefined
  const search = rawSearch ? rawSearch.toLowerCase() : undefined

  const productsByCategory = await getProductsByCategory(slug, maxPrice)

  const products = search
    ? productsByCategory.filter((p) =>
        p.title.toLowerCase().includes(search)
      )
    : productsByCategory

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

      {/* TITLE */}

      <h1 className="text-3xl font-bold mb-8">
        {categoryName}
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">

        {/* FILTER */}

        <CategoryFilter categorySlug={slug} />


        {/* PRODUCTS */}

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