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

  // GET CATEGORY NAME

  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug === slug)

  const categoryName = category?.name || decodeURIComponent(slug)


  // PRICE FILTER

  const rawPrice = Array.isArray(searchParams?.price)
    ? searchParams?.price[0]
    : searchParams?.price

  const maxPrice = rawPrice ? Number(rawPrice) : undefined


  // SEARCH FILTER

  const rawSearch = Array.isArray(searchParams?.search)
    ? searchParams?.search[0]
    : searchParams?.search

  const search = rawSearch ? rawSearch.toLowerCase() : undefined


  // FETCH PRODUCTS

  const productsByCategory = await getProductsByCategory(slug, maxPrice)


  const products = search
    ? productsByCategory.filter((p) =>
        p.title.toLowerCase().includes(search)
      )
    : productsByCategory


  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">

      {/* BREADCRUMB */}

      <div className="text-sm text-gray-500">
        Главная / Каталог / <span className="text-black">{categoryName}</span>
      </div>


      {/* TITLE */}

      <h1 className="text-3xl font-bold text-[#1a1f4b]">
        {categoryName}
      </h1>


      {/* FILTER */}

      <CategoryFilter categorySlug={slug} />


      {/* PRODUCTS */}

      {products.length === 0 ? (
        <div className="text-gray-500 py-10">
          Товары в этой категории пока отсутствуют.
        </div>
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

    </main>
  )
}