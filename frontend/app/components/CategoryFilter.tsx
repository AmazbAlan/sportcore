'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Props {
  categorySlug: string
}

export default function CategoryFilter({ categorySlug }: Props) {

  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [price, setPrice] = useState(searchParams.get('price') || '')

  const apply = () => {

    const qp = new URLSearchParams()

    if (search) qp.set('search', search)
    if (price) qp.set('price', price)

    router.push(`/category/${categorySlug}?${qp.toString()}`)
  }

  const reset = () => {
    router.push(`/category/${categorySlug}`)
  }

  return (
    <aside className="bg-white rounded-xl shadow p-5 space-y-6 sticky top-6">

      <h2 className="font-semibold text-lg">
        Фильтры
      </h2>

      {/* SEARCH */}

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Поиск товара
        </label>

        <input
          type="text"
          placeholder="Например: ролл"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
          w-full
          border
          rounded-lg
          px-3
          py-2
          focus:ring-2
          focus:ring-blue-500
          outline-none
          "
        />

      </div>


      {/* PRICE */}

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Максимальная цена
        </label>

        <input
          type="range"
          min="0"
          max="20000"
          step="100"
          value={price || 0}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />

        <div className="text-sm text-gray-500">
          {price ? `${price} сом` : 'Без ограничений'}
        </div>

      </div>


      {/* BUTTONS */}

      <div className="flex gap-2">

        <button
          onClick={apply}
          className="
          bg-yellow-500
          hover:bg-yellow-600
          text-white
          px-4
          py-2
          rounded-lg
          w-full
          "
        >
          Применить
        </button>

        <button
          onClick={reset}
          className="
          bg-gray-200
          hover:bg-gray-300
          px-4
          py-2
          rounded-lg
          "
        >
          Сброс
        </button>

      </div>

    </aside>
  )
}