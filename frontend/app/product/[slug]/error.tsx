'use client'

import { useEffect } from 'react'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем ошибку — в Vercel будет видна в логах функций
    console.error('Product page error:', error)
  }, [error])

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Не удалось загрузить товар
      </h1>
      <p className="text-gray-600 mb-6">
        Попробуйте обновить страницу или вернитесь в каталог.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2 bg-yellow-400 text-[#1a1f4b] rounded hover:bg-yellow-300 font-semibold"
        >
          Обновить
        </button>
        <a
          href="/category"
          className="px-5 py-2 bg-white border border-gray-300 text-gray-800 rounded hover:bg-gray-50"
        >
          В каталог
        </a>
      </div>
    </main>
  )
}