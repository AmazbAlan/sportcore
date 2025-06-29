'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'

interface CategoryFilterProps {
  categorySlug: string
}

export default function CategoryFilter({ categorySlug }: CategoryFilterProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  // инициализируем значения из URL
  const initPrice  = searchParams.get('price')  || ''
  const initSearch = searchParams.get('search') || ''

  const [price,  setPrice]  = useState(initPrice)
  const [search, setSearch] = useState(initSearch)

  // при смене URL ресетим локальный state
  useEffect(() => {
    setPrice(initPrice)
    setSearch(initSearch)
  }, [initPrice, initSearch])

  // составляем новый URL и пушим
  const apply = () => {
    const qp = new URLSearchParams()
    qp.set('price',  price)
    qp.set('search', search)
    // обязательно фильтр по категории остаётся
    qp.set('filters[category][slug][$eq]', categorySlug)
    router.push(`${pathname}?${qp.toString()}`)
  }

  const reset = () => {
    router.push(pathname + `?filters[category][slug][$eq]=${categorySlug}`)
  }

  return (
    <div className="border rounded-lg p-4 mb-6 bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>

      {/* Поиск */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Поиск</label>
        <input
          type="text"
          placeholder="Название..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Цена */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Макс. цена: {price || '∞'} сом
        </label>
        <input
          type="range"
          min="0"
          max="20000"
          step="100"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Кнопки */}
      <div className="flex space-x-2">
        <button
          onClick={apply}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Применить
        </button>
        <button
          onClick={reset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}
