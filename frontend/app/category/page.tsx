// frontend/app/category/page.tsx
import React from 'react'
import Link from 'next/link'
import { getAllCategories, Category } from '../../lib/api'

export const dynamic = 'force-dynamic'

export default async function CategoryIndexPage() {
  const categories: Category[] = await getAllCategories()
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Категории</h1>
      {categories.length === 0 ? (
        <p>Нет доступных категорий.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="block p-4 border rounded hover:bg-gray-100"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
