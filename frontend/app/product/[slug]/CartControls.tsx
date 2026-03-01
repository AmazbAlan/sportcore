'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useCart } from '../../../app/context/CartContext'
import type { Product, ProductVariant, VariantColor } from '../../../lib/api'

interface CartControlsProps {
  product: Product
}

export default function CartControls({ product }: CartControlsProps) {
  const { add } = useCart()

  const [variant, setVariant] = useState<ProductVariant | null>(null)
  const [color, setColor] = useState<VariantColor | null>(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)

  // UI state для понятного отклика
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    const v = product.variants?.[0] ?? null
    setVariant(v)
    setColor(v?.color?.[0] ?? null)
    setQty(1)
    setLoading(false)
    setJustAdded(false)
  }, [product])

  // логика наличия оставляем, но НЕ показываем цифры
  const available = Number((variant as any)?.stock ?? (product as any)?.stock ?? 0)
  const outOfStock = available <= 0

  const hasColors = (variant?.color?.length ?? 0) > 0

  const handleVariantClick = (v: ProductVariant) => {
    if (loading) return
    setVariant(v)
    setColor(v.color?.[0] ?? null)
    setQty(1)
  }

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10) || 1
    setQty(Math.max(1, v))
  }

  const handleAdd = useCallback(async () => {
    if (!variant || outOfStock) return
    if (hasColors && !color) return

    setLoading(true)
    setJustAdded(false)

    try {
      const sizePart = variant.size ? `${variant.size}` : ''
      const colorPart = hasColors && color?.name ? `, ${color.name}` : ''
      const suffix = sizePart || colorPart ? ` (${sizePart}${colorPart})` : ''

      add(
        {
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          title: `${product.title}${suffix}`,
          price: product.price,
          ...(hasColors && color?.name ? { color: color.name } : {}),
        },
        qty
      )

      // ✅ визуальный отклик
      setJustAdded(true)
      window.setTimeout(() => setJustAdded(false), 1200)
    } finally {
      setLoading(false)
    }
  }, [add, product, variant, color, qty, outOfStock, hasColors])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm text-slate-500">Параметры</p>
          <p className="text-base font-semibold text-slate-900">Выберите вариант</p>
        </div>

        {/* Показываем только статус, без цифр */}
        <span
          className={[
            'rounded-full border px-3 py-1 text-xs font-medium',
            outOfStock
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200',
          ].join(' ')}
        >
          {outOfStock ? 'Нет в наличии' : 'В наличии'}
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {!variant ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
          </div>
        ) : (
          <>
            {/* Параметры (бывший "Размер") */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Размер / параметры
                </span>
                <span className="text-xs text-slate-500">Нажмите, чтобы выбрать</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => {
                  const vStock = Number((v as any)?.stock ?? 0)
                  const isActive = variant.id === v.id
                  const disabled = vStock === 0 || loading

                  return (
                    <button
                      key={`${v.id}-${v.size}-${idx}`}
                      onClick={() => handleVariantClick(v)}
                      disabled={disabled}
                      type="button"
                      className={[
                        'rounded-xl border px-4 py-2 text-sm font-semibold transition',
                        'focus:outline-none focus:ring-4 focus:ring-yellow-200',
                        isActive
                          ? 'border-yellow-500 bg-yellow-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
                        disabled ? 'cursor-not-allowed opacity-50' : '',
                      ].join(' ')}
                    >
                      {v.size ?? 'Параметр'}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Цвет */}
            {hasColors ? (
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Цвет</span>
                  <span className="text-xs text-slate-500">
                    {color?.name ? `Выбран: ${color.name}` : 'Выберите цвет'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {variant.color!.map((c, idx) => {
                    const imageUrl = c.image?.[0]?.url ?? ''
                    const active = color?.name === c.name

                    return (
                      <button
                        key={`${c.name}-${idx}`}
                        onClick={() => setColor(c)}
                        type="button"
                        className={[
                          'flex items-center gap-2 rounded-xl border px-3 py-2 transition',
                          'focus:outline-none focus:ring-4 focus:ring-yellow-200',
                          active
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                          loading ? 'cursor-not-allowed opacity-60' : '',
                        ].join(' ')}
                        disabled={loading}
                        title={c.name}
                      >
                        <span
                          className={[
                            'h-7 w-7 overflow-hidden rounded-full border',
                            active ? 'border-yellow-500' : 'border-slate-200',
                          ].join(' ')}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={c.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="block h-full w-full bg-slate-200" />
                          )}
                        </span>

                        <span className="text-sm font-medium text-slate-900">{c.name}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {/* Количество (без "макс", без остатков) */}
            <section className="space-y-2">
              <span className="text-sm font-semibold text-slate-900">Количество</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={outOfStock || loading || qty <= 1}
                  className="
                    h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-800
                    hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
                    focus:outline-none focus:ring-4 focus:ring-yellow-200
                  "
                  aria-label="Уменьшить количество"
                >
                  −
                </button>

                <input
                  id="qty"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={handleQtyChange}
                  disabled={outOfStock || loading}
                  className="
                    h-10 w-24 rounded-xl border border-slate-200 bg-white px-3 text-center
                    text-sm font-semibold text-slate-900
                    focus:outline-none focus:ring-4 focus:ring-yellow-200
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                />

                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  disabled={outOfStock || loading}
                  className="
                    h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-800
                    hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
                    focus:outline-none focus:ring-4 focus:ring-yellow-200
                  "
                  aria-label="Увеличшить количество"
                >
                  +
                </button>
              </div>
            </section>

            {/* CTA с понятной анимацией */}
            <div className="pt-2">
              <button
                onClick={handleAdd}
                disabled={outOfStock || loading || (hasColors && !color)}
                type="button"
                className={[
                  'relative w-full rounded-2xl px-5 py-3 text-base font-semibold text-white',
                  'shadow-sm transition focus:outline-none focus:ring-4 focus:ring-yellow-200',
                  'active:scale-[0.99]',
                  outOfStock || (hasColors && !color)
                    ? 'bg-slate-300 cursor-not-allowed'
                    : justAdded
                      ? 'bg-emerald-600'
                      : 'bg-yellow-500 hover:brightness-95',
                ].join(' ')}
              >
                {/* спиннер */}
                {loading && (
                  <span
                    className="absolute inset-0 m-auto h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                )}

                {/* “пинг” когда добавили */}
                {justAdded && !loading && (
                  <span
                    className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-emerald-400 animate-ping"
                    aria-hidden="true"
                  />
                )}

                <span className={loading ? 'opacity-0' : ''}>
                  {outOfStock
                    ? 'Нет в наличии'
                    : justAdded
                      ? 'Добавлено ✓'
                      : 'Добавить в корзину'}
                </span>
              </button>

              {hasColors && !color ? (
                <p className="mt-2 text-xs text-slate-500">Выберите цвет, чтобы продолжить.</p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}