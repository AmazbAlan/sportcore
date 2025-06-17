// frontend/app/category/page.tsx
import { getAllCategories } from '../../lib/api'
import CategoryCard from '../components/CategoryCard'

export const dynamic = 'force-dynamic'

export default async function CategoryIndexPage() {
  const categories = await getAllCategories()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Все категории</h1>
      {categories.length === 0 ? (
        <p>Нет доступных категорий.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              title={cat.name}
              image={cat.imageUrl}
              href={`/category/${cat.slug}`}
            />
          ))}
        </div>
      )}
    </main>
  )
}
