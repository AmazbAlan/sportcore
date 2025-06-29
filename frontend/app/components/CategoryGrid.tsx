import CategoryCard from './CategoryCard'
import { getBannerCategories } from '../../lib/api'

export default async function CategoryGrid() {
  const categories = await getBannerCategories()
  console.log('Categories from Strapi:', categories)

  // Разбиваем на 2 ряда
  const topRow = categories.slice(0, 3)
  const bottomRow = categories.slice(3, 5)

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 space-y-8">
      <h2 className="text-2xl font-bold text-[#1a1f4b]">Популярные категории</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topRow.map((cat, index) => (
          <CategoryCard
            key={cat.slug || `top-${index}`}
            title={cat.name}
            image={cat.imageUrl}
            href={`/category/${cat.slug}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {bottomRow.map((cat, index) => (
          <CategoryCard
            key={cat.slug || `bottom-${index}`}
            title={cat.name}
            image={cat.imageUrl}
            href={`/category/${cat.slug}`}
          />
        ))}
      </div>
    </section>
  )
}
