import CategoryCard from './CategoryCard'
import { getBannerCategories } from '../../lib/api'

export const dynamic = 'force-dynamic'

export default async function CategoryGrid() {
  const categories = await getBannerCategories()

  if (!categories.length) return null

  const topRow = categories.slice(0, 3)
  const bottomRow = categories.slice(3, 5)

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      <h2 className="text-3xl font-bold text-[#1a1f4b] mb-10">
        Популярные категории
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {topRow.map((cat) => (
          <CategoryCard
            key={cat.slug}
            title={cat.name}
            image={cat.imageUrl}
            href={`/category/${cat.slug}`}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {bottomRow.map((cat) => (
          <CategoryCard
            key={cat.slug}
            title={cat.name}
            image={cat.imageUrl}
            href={`/category/${cat.slug}`}
          />
        ))}
      </div>

    </section>
  )
}