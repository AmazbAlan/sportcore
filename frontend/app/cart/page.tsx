// frontend/app/cart/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

function formatSom(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export default function CartPage() {
  const { items, update, remove, total } = useCart()
  // если у тебя есть clear() — раскомментируй:
  // const { clear } = useCart()

  const totalValue = total()

  return (
    <main className="min-h-[calc(100vh-120px)] bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Ваша корзина</h1>
              <p className="mt-1 text-slate-500">
                Проверьте товары и количество перед оформлением.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-sm">
                Позиций: {items.length}
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="text-slate-700 font-medium">Корзина пустая</div>
              <p className="mt-1 text-slate-500">Добавьте товары из каталога, чтобы оформить заказ.</p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-white font-semibold hover:bg-slate-800 transition"
              >
                Вернуться в магазин
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              {/* Список товаров */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="w-full text-left table-fixed">
                    <thead className="bg-slate-50">
                      <tr className="text-sm text-slate-600">
                        <th className="px-6 py-4 font-semibold">Товар</th>
                        <th className="px-6 py-4 font-semibold">Размер</th>
                        <th className="px-6 py-4 font-semibold">Цена</th>
                        <th className="px-6 py-4 font-semibold">Кол-во</th>
                        <th className="px-6 py-4 font-semibold text-right">Сумма</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {items.map((i) => {
                        const sizeMatch = i.title.match(/\((.+)\)$/)
                        const size = sizeMatch ? sizeMatch[1] : ''
                        const name = size ? i.title.replace(/\s*\(.+\)$/, '') : i.title

                        return (
                          <tr key={i.id} className="align-top">
                            <td className="px-6 py-5">
                              <div className="min-w-0">
                                <Link
                                  href={`/product/${i.slug}`}
                                  className="font-semibold text-slate-900 hover:underline"
                                >
                                  {name}
                                </Link>
                                <div className="mt-1 text-sm text-slate-500 truncate">
                                  {i.slug}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-slate-700">
                              {size ? (
                                <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-sm">
                                  {size}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-700 whitespace-nowrap">
                              {formatSom(i.price)} сом
                            </td>

                            <td className="px-6 py-5">
  <div className="inline-flex items-center gap-2 whitespace-nowrap">
    <button
      type="button"
      onClick={() => update(i.id, Math.max(1, i.qty - 1))}
      className="shrink-0 h-9 w-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition"
      aria-label="Уменьшить количество"
    >
      −
    </button>

    <input
      type="number"
      min={1}
      value={i.qty}
      onChange={(e) => update(i.id, Math.max(1, Number(e.target.value)))}
      className="shrink-0 h-9 w-16 rounded-lg border border-slate-300 px-2 text-center outline-none
                 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    />

    <button
      type="button"
      onClick={() => update(i.id, i.qty + 1)}
      className="shrink-0 h-9 w-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition"
      aria-label="Увеличить количество"
    >
      +
    </button>
  </div>
</td>

                            <td className="px-6 py-5 text-right font-semibold text-slate-900 whitespace-nowrap">
                              {formatSom(i.price * i.qty)} сом
                            </td>

                            <td className="px-6 py-5 text-right">
                              <button
                                onClick={() => remove(i.id)}
                                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                                aria-label="Удалить"
                                title="Удалить"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden p-4 space-y-3">
                  {items.map((i) => {
                    const sizeMatch = i.title.match(/\((.+)\)$/)
                    const size = sizeMatch ? sizeMatch[1] : ''
                    const name = size ? i.title.replace(/\s*\(.+\)$/, '') : i.title

                    return (
                      <div
                        key={i.id}
                        className="rounded-2xl border border-slate-200 p-4 bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/product/${i.slug}`}
                              className="font-semibold text-slate-900"
                            >
                              {name}
                            </Link>
                            <div className="mt-1 text-sm text-slate-500">
                              {size ? `Размер: ${size}` : 'Размер: —'}
                            </div>
                          </div>

                          <button
                            onClick={() => remove(i.id)}
                            className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg border border-red-200 bg-red-50 text-red-700"
                            aria-label="Удалить"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                            <div className="text-slate-500">Цена</div>
                            <div className="font-semibold text-slate-900">
                              {formatSom(i.price)} сом
                            </div>
                          </div>

                          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                            <div className="text-slate-500">Сумма</div>
                            <div className="font-semibold text-slate-900">
                              {formatSom(i.price * i.qty)} сом
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-slate-500">Количество</div>
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => update(i.id, Math.max(1, i.qty - 1))}
                              className="h-9 w-9 rounded-lg border border-slate-300 bg-white"
                              aria-label="Уменьшить количество"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min={1}
                              value={i.qty}
                              onChange={(e) => update(i.id, Math.max(1, Number(e.target.value)))}
                              className="h-9 w-16 rounded-lg border border-slate-300 px-2 text-center outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => update(i.id, i.qty + 1)}
                              className="h-9 w-9 rounded-lg border border-slate-300 bg-white"
                              aria-label="Увеличить количество"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Итог */}
              <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit lg:sticky lg:top-6">
                <h2 className="text-lg font-bold text-slate-900">Итого</h2>

                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Сумма</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatSom(totalValue)} сом
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white
                             hover:bg-green-700 transition"
                >
                  Оформить заказ
                </Link>

                <Link
                  href="/"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900
                             hover:bg-slate-50 transition"
                >
                  Продолжить покупки
                </Link>

                {/* Если у тебя есть clear() в контексте — включи: */}
                {/*
                <button
                  onClick={clear}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700
                             hover:bg-red-100 transition"
                >
                  Очистить корзину
                </button>
                */}
              </aside>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}