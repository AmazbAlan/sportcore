'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
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

  useEffect(() => {
    const v = product.variants?.[0] ?? null
    setVariant(v)
    setColor(v?.color?.[0] ?? null)
    setQty(1)
    setLoading(false)
  }, [product])

  const available = Number((variant as any)?.stock ?? (product as any)?.stock ?? 0)
  const outOfStock = available <= 0
  const hasColors = (variant?.color?.length ?? 0) > 0

  const maxQty = available > 0 ? available : 1

  const stockLabel = useMemo(() => {
    if (outOfStock) return 'Нет в наличии'
    if (available <= 3) return `Мало (осталось ${available})`
    return 'В наличии'
  }, [outOfStock, available])

  const stockClass = outOfStock
    ? 'bg-red-50 text-red-700 border-red-200'
    : available <= 3
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200'

  const handleVariantClick = (v: ProductVariant) => {
    if (loading) return
    setVariant(v)
    setColor(v.color?.[0] ?? null)
    setQty(1)
  }

  const setQtySafe = (next: number) => {
    const clamped = Math.min(Math.max(1, next), maxQty)
    setQty(clamped)
  }

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10)
    if (Number.isNaN(v)) return setQtySafe(1)
    setQtySafe(v)
  }

  const handleAdd = useCallback(async () => {
    if (!variant || outOfStock) return
    if (hasColors && !color) return

    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }, [add, product, variant, color, qty, outOfStock, hasColors])

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">Параметры</p>
            <p className="truncate text-base font-semibold text-slate-900">
              Выберите вариант
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${stockClass}`}
            aria-live="polite"
          >
            {stockLabel}
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
              {/* Размер */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Размер</span>
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
                          'group relative rounded-xl border px-4 py-2 text-sm font-semibold transition',
                          'focus:outline-none focus:ring-4 focus:ring-yellow-200',
                          isActive
                            ? 'border-yellow-500 bg-yellow-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
                          disabled ? 'cursor-not-allowed opacity-50' : '',
                        ].join(' ')}
                      >
                        <span className="flex items-center gap-2">
                          <span>{v.size ?? '—'}</span>

                          {/* маленький индикатор остатка */}
                          <span
                            className={[
                              'rounded-full px-2 py-0.5 text-[11px] font-medium',
                              vStock === 0
                                ? 'bg-red-50 text-red-700'
                                : vStock <= 3
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-700',
                            ].join(' ')}
                            title={vStock === 0 ? 'Нет в наличии' : `Остаток: ${vStock}`}
                          >
                            {vStock === 0 ? '0' : vStock}
                          </span>
                        </span>
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
                              // eslint-disable-next-line @next/next/no-img-element
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

              {/* Количество */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Количество</span>
                  <span className="text-xs text-slate-500">Макс: {available}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQtySafe(qty - 1)}
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
                    max={maxQty}
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
                    onClick={() => setQtySafe(qty + 1)}
                    disabled={outOfStock || loading || qty >= maxQty}
                    className="
                      h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-800
                      hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
                      focus:outline-none focus:ring-4 focus:ring-yellow-200
                    "
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>

                {!outOfStock && available <= 3 ? (
                  <p className="text-xs text-amber-700">
                    Осталось мало — лучше заказать сейчас.
                  </p>
                ) : null}
              </section>

              {/* CTA */}
              <div className="pt-2">
                <button
                  onClick={handleAdd}
                  disabled={outOfStock || loading || (hasColors && !color)}
                  type="button"
                  className="
                    relative w-full rounded-2xl bg-yellow-500 px-5 py-3 text-base font-semibold text-white
                    shadow-sm transition
                    hover:brightness-95 active:brightness-90
                    disabled:cursor-not-allowed disabled:bg-slate-300
                    focus:outline-none focus:ring-4 focus:ring-yellow-200
                  "
                >
                  {loading && (
                    <span
                      className="absolute inset-0 m-auto h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  <span className={loading ? 'opacity-0' : ''}>
                    {outOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
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
    </div>
  )
}