'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Props {
  categorySlug: string
}

export default function CategoryFilter({ categorySlug }: Props) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initPrice = searchParams.get('price') || ''
  const initSearch = searchParams.get('search') || ''

  const [price, setPrice] = useState(initPrice)
  const [search, setSearch] = useState(initSearch)

  useEffect(() => {
    setPrice(initPrice)
    setSearch(initSearch)
  }, [initPrice, initSearch])

  const apply = () => {

    const qp = new URLSearchParams()

    if (price) qp.set('price', price)
    if (search) qp.set('search', search)

    qp.set('category', categorySlug)

    router.push(`${pathname}?${qp.toString()}`)
  }

  const reset = () => {
    router.push(`${pathname}?category=${categorySlug}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border">

      <div className="grid md:grid-cols-3 gap-4 items-end">

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

        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Макс. цена
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

          <div className="text-sm text-gray-500 mt-1">
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
            Сбросить
          </button>

        </div>

      </div>

    </div>
  )
}