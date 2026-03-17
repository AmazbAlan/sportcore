'use client'

import { useState } from 'react'
import CategoryCard from '../components/CategoryCard'

export default function CategoryPageClient({ categories }: any) {
  const [query, setQuery] = useState('')

  const filtered = categories.filter((c: any) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a1f4b] mb-8">
        Каталог
      </h1>

      {/* SEARCH */}
      <div className="mb-10 max-w-md">
        <input
          type="text"
          placeholder="Поиск категории..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full
            border border-gray-300
            rounded-lg
            px-4 py-3
            shadow-sm
            focus:ring-2 focus:ring-blue-500
            outline-none
          "
        />
      </div>

      {/* CATEGORIES */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          Категории не найдены
        </div>
      ) : (
        <div className="
          grid 
          grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-4 md:gap-6
        ">
          {filtered.map((cat: any) => (
            <CategoryCard
              key={cat.slug}
              title={cat.name}
              image={cat.imageUrl}
              href={`/category/${cat.slug}`}
              variant="grid"
            />
          ))}
        </div>
      )}
    </main>
  )
}