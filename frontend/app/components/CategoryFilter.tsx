'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'

interface CategoryFilterProps {
  categorySlug: string
}

export default function CategoryFilter({ categorySlug }: CategoryFilterProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initPrice  = searchParams.get('price')  || ''
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">

      <h2 className="text-xl font-bold mb-6 text-[#1a1f4b]">
        Фильтры
      </h2>

      {/* SEARCH */}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Поиск товара
        </label>

        <input
          type="text"
          placeholder="Например: ролл, мяч..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
          w-full
          border
          rounded-lg
          px-4
          py-2
          focus:ring-2
          focus:ring-blue-500
          outline-none
          "
        />
      </div>


      {/* PRICE */}

      <div className="mb-6">

        <label className="block text-sm font-medium mb-2">
          Максимальная цена
        </label>

        <div className="flex items-center gap-4">

          <input
            type="range"
            min="0"
            max="20000"
            step="100"
            value={price || 0}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full"
          />

          <span className="text-sm font-semibold w-[90px] text-right">
            {price ? `${price} сом` : '∞'}
          </span>

        </div>
      </div>


      {/* BUTTONS */}

      <div className="flex gap-3">

        <button
          onClick={apply}
          className="
          bg-yellow-500
          hover:bg-yellow-600
          text-white
          px-5
          py-2
          rounded-lg
          font-medium
          "
        >
          Применить
        </button>

        <button
          onClick={reset}
          className="
          bg-gray-200
          hover:bg-gray-300
          px-5
          py-2
          rounded-lg
          "
        >
          Сбросить
        </button>

      </div>

    </div>
  )
}