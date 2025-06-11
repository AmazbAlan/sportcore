// frontend/app/components/CategoryFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function CategoryFilter() {
  const router = useRouter()
  const params = useSearchParams()

  // Пример только для price
  const [price, setPrice] = useState(params.get('price') || '10000')

  useEffect(() => {
    const q = new URLSearchParams()
    if (price) q.set('price', price)
    router.push(`?${q.toString()}`)
  }, [price, router])

  const reset = () => {
    setPrice('10000')
    router.push('?')
  }

  return (
    <div className="border rounded-lg p-4 mb-6 bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
      <div className="mb-4">
        <label className="block mb-1">Макс. цена: {price} сом</label>
        <input
          type="range"
          min="0"
          max="20000"
          step="500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />
      </div>
      <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded">
        Сбросить
      </button>
    </div>
  )
}
