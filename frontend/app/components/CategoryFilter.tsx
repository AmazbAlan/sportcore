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
    <aside className="
    bg-white
    rounded-2xl
    border
    border-gray-100
    shadow-sm
    p-6
    space-y-6
    h-fit
    ">

      <h2 className="font-semibold text-lg text-[#1f2937]">
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
          className="
          w-full
          border
          border-gray-300
          rounded-lg
          px-3
          py-2.5
          transition
          focus:border-[#F5B301]
          focus:ring-2
          focus:ring-[#F5B301]/30
          outline-none
          "
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
            className="
            px-3 py-1.5
            rounded-full
            text-sm
            border
            border-gray-300
            transition
            hover:bg-gray-100
            active:scale-[0.95]
            "
          >
            до 1000
          </button>

          <button
            onClick={() => quickPrice(1000, 3000)}
            className="
            px-3 py-1.5
            rounded-full
            text-sm
            border
            border-gray-300
            transition
            hover:bg-gray-100
            active:scale-[0.95]
            "
          >
            1000–3000
          </button>

          <button
            onClick={() => quickPrice(3000, 5000)}
            className="
            px-3 py-1.5
            rounded-full
            text-sm
            border
            border-gray-300
            transition
            hover:bg-gray-100
            active:scale-[0.95]
            "
          >
            3000–5000
          </button>

          <button
            onClick={() => quickPrice(5000)}
            className="
            px-3 py-1.5
            rounded-full
            text-sm
            border
            border-gray-300
            transition
            hover:bg-gray-100
            active:scale-[0.95]
            "
          >
            5000+
          </button>

        </div>

      </div>


      {/* BUTTONS */}

      <div className="flex gap-3 pt-2">

        <button
          onClick={apply}
          className="
          flex-1
          bg-[#F5B301]
          text-white
          font-medium
          px-4
          py-2.5
          rounded-lg
          shadow-sm
          transition
          hover:bg-[#E0A200]
          active:bg-[#C98F00]
          active:scale-[0.97]
          focus:outline-none
          focus:ring-2
          focus:ring-[#F5B301]/40
          "
        >
          Применить
        </button>

        <button
          onClick={reset}
          className="
          px-4
          py-2.5
          rounded-lg
          border
          border-gray-300
          text-gray-700
          transition
          hover:bg-gray-100
          active:scale-[0.97]
          "
        >
          Сброс
        </button>

      </div>

    </aside>
  )
}