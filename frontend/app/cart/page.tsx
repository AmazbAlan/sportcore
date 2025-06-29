// frontend/app/cart/page.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, update, remove, total } = useCart()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ваша корзина</h1>
      {items.length === 0 ? (
        <p>
          Корзина пуста. <Link href="/">Вернуться в магазин</Link>
        </p>
      ) : (
        <>
          <table className="w-full mb-4 table-auto text-left">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Размер</th>
                <th>Цена</th>
                <th>Кол-во</th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                // Если в title есть "(SIZE)", вытягиваем его
                const sizeMatch = i.title.match(/\((.+)\)$/)
                const size = sizeMatch ? sizeMatch[1] : ''
                // Обрезаем размер из названия для показа чистого названия
                const name = size
                  ? i.title.replace(/\s*\(.+\)$/, '')
                  : i.title

                return (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/product/${i.slug}`}>{name}</Link>
                    </td>
                    <td>{size}</td>
                    <td>{i.price} сом</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={i.qty}
                        onChange={(e) =>
                          update(i.id, Math.max(1, +e.target.value))
                        }
                        className="w-16 border rounded px-2 py-1"
                      />
                    </td>
                    <td>{i.price * i.qty} сом</td>
                    <td>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-red-600 hover:underline"
                        aria-label="Удалить"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="text-right font-semibold mb-6">
            Всего: {total()} сом
          </div>

          <Link
            href="/checkout"
            className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Оформить заказ
          </Link>
        </>
      )}
    </main>
  )
}
