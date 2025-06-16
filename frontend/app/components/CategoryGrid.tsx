// frontend/app/components/CategoryGrid.tsx
import CategoryCard from './CategoryCard'
import { getBannerCategories } from '../../lib/api'

export default async function CategoryGrid() {
  const cats = await getBannerCategories()
  const topRow    = cats.slice(0, 3)
  const bottomRow = cats.slice(3, 5)

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 space-y-6">
      {/* 3 карточки сверху */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topRow.map((cat) => (
          <CategoryCard
            key={cat.slug}
            title={cat.name}
            image={cat.imageUrl}
            href={`/category/${cat.slug}`}
          />
        ))}
      </div>

      {/* 2 карточки снизу */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
