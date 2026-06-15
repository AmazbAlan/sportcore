'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Props {
  categorySlug: string
}

export default function CategoryFilter({ categorySlug }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [search,   setSearch]   = useState(searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '')
  const [open,     setOpen]     = useState(false)

  const apply = () => {
    const qp = new URLSearchParams()
    if (search)   qp.set('search', search)
    if (minPrice) qp.set('min', minPrice)
    if (maxPrice) qp.set('max', maxPrice)
    router.push(`/category/${categorySlug}?${qp.toString()}`)
  }

  const reset = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    router.push(`/category/${categorySlug}`)
  }

  const quickPrice = (min: number, max?: number) => {
    setMinPrice(String(min))
    setMaxPrice(max ? String(max) : '')
  }

  const hasActive = Boolean(search || minPrice || maxPrice)

  return (
    <aside>
      {/* Мобильный тоггл */}
      <button
        onClick={() => setOpen(v => !v)}
        className="md:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3.5 shadow-sm mb-2"
      >
        <span className="font-semibold text-[#1f2937] flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zM10 19a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z" />
          </svg>
          Фильтр
          {hasActive && (
            <span className="bg-yellow-400 text-[#1a1f4b] text-[10px] font-black px-1.5 py-0.5 rounded-md">
              активен
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Тело фильтра */}
      <div
        className={`
          bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6
          md:block
          overflow-hidden transition-all duration-300
          ${open ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 border-0 p-0 shadow-none'}
          md:max-h-none md:opacity-100 md:p-6 md:border md:shadow-sm md:mb-0
        `}
      >
        <h2 className="font-semibold text-lg text-[#1f2937] hidden md:block">Фильтр</h2>

        {/* Поиск */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Поиск товара</label>
          <input
            type="text"
            placeholder="Например: кроссовки"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none"
          />
        </div>

        {/* Цена */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">Цена (сом)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="От"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
            />
            <input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
            />
          </div>
        </div>

        {/* Быстрый выбор */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Быстрый выбор</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'до 1 000',    min: 0,    max: 1000 },
              { label: '1–3 тыс.',    min: 1000, max: 3000 },
              { label: '3–5 тыс.',    min: 3000, max: 5000 },
              { label: 'от 5 000',    min: 5000, max: undefined },
            ].map(({ label, min, max }) => (
              <button
                key={label}
                onClick={() => quickPrice(min, max)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 transition-colors active:scale-95"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={apply}
            className="flex-1 bg-yellow-400 text-[#1a1f4b] font-bold px-4 py-2.5 rounded-xl text-sm shadow-sm hover:bg-yellow-300 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          >
            Применить
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            Сброс
          </button>
        </div>
      </div>
    </aside>
  )
}
