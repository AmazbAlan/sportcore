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
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '')

  const apply = () => {

    const qp = new URLSearchParams()

    if (search) qp.set('search', search)
    if (minPrice) qp.set('min', minPrice)
    if (maxPrice) qp.set('max', maxPrice)

    router.push(`/category/${categorySlug}?${qp.toString()}`)
  }

  const reset = () => {
    router.push(`/category/${categorySlug}`)
  }

  const quickPrice = (min: number, max?: number) => {

    setMinPrice(String(min))
    setMaxPrice(max ? String(max) : '')
  }

  return (
    <aside className="bg-white rounded-xl shadow-sm p-5 space-y-6">

      <h2 className="font-semibold text-lg">
        Фильтр
      </h2>

      {/* SEARCH */}

      <div>

        <label className="text-sm text-gray-600 block mb-1">
          Поиск товара
        </label>

        <input
          type="text"
          placeholder="Например: ролл"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

      </div>


      {/* PRICE */}

      <div>

        <label className="text-sm text-gray-600 block mb-2">
          Цена
        </label>

        <div className="flex gap-2">

          <input
            type="number"
            placeholder="От"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="До"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

        </div>

      </div>


      {/* QUICK PRICE */}

      <div className="space-y-2">

        <div className="text-sm text-gray-600">
          Быстрый выбор
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => quickPrice(0, 1000)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            до 1000
          </button>

          <button
            onClick={() => quickPrice(1000, 3000)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            1000–3000
          </button>

          <button
            onClick={() => quickPrice(3000, 5000)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            3000–5000
          </button>

          <button
            onClick={() => quickPrice(5000)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            5000+
          </button>

        </div>

      </div>


      {/* BUTTONS */}

      <div className="flex gap-2">

        <button
          onClick={apply}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Применить
        </button>

        <button
          onClick={reset}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Сброс
        </button>

      </div>

    </aside>
  )
}