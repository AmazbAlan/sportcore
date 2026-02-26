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

  // при смене товара сразу выбираем первый вариант
  useEffect(() => {
    const v = product.variants?.[0] ?? null
    setVariant(v)
    setColor(v?.color?.[0] ?? null)
    setQty(1)
    setLoading(false)
  }, [product])

  const available = Number(variant?.stock ?? 0)
  const outOfStock = available <= 0

  const handleVariantClick = (v: ProductVariant) => {
    if (loading) return
    setVariant(v)
    setColor(v.color?.[0] ?? null)
    setQty(1)
  }

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10) || 1
    setQty(Math.min(Math.max(1, v), available || 1))
  }

  const handleAdd = useCallback(async () => {
    if (!variant || !color || outOfStock) return
    setLoading(true)
    try {
      add(
        {
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          title: `${product.title} (${variant.size}, ${color.name})`,
          price: product.price,
          color: color.name,
        },
        qty
      )
    } finally {
      setLoading(false)
    }
  }, [add, product, variant, color, qty, outOfStock])

  return (
    <div className="mt-6 space-y-4 bg-white p-4 rounded shadow">
      {!variant ? (
        <p>Загрузка вариантов...</p>
      ) : (
        <>
          {/* 1. Размеры */}
          <div>
            <span className="font-medium block mb-2">Размер:</span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, idx) => {
                const vStock = Number(v.stock ?? 0)
                const isActive = variant.size === v.size && variant.id === v.id
                return (
                  <button
                    key={`${v.id}-${v.size}-${idx}`}
                    onClick={() => handleVariantClick(v)}
                    disabled={vStock === 0 || loading}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-full border
                      ${isActive ? 'border-yellow-500' : 'border-gray-300'}
                      ${vStock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-500'}
                    `}
                  >
                    <span className="text-sm font-medium">{v.size}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Цвет */}
          {variant.color?.length ? (
            <div>
              <span className="font-medium block mb-2">Цвет:</span>
              <div className="flex flex-wrap gap-3">
                {variant.color.map((c, idx) => {
                  const imageUrl = c.image?.[0]?.url ?? ''

                  return (
                    <button
                      key={`${c.name}-${idx}`}
                      onClick={() => setColor(c)}
                      className={`
                        w-14 h-14 rounded-full border-2 overflow-hidden
                        flex items-center justify-center
                        ${color?.name === c.name ? 'border-yellow-500' : 'border-gray-300'}
                        hover:border-yellow-500
                      `}
                      title={c.name}
                      type="button"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="w-full h-full bg-gray-300" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {/* 3. Наличие */}
          <div>
            <span className="font-medium">Наличие:</span>{' '}
            {outOfStock ? (
              <span className="text-red-600">Нет в наличии</span>
            ) : (
              <span className="text-green-600">В наличии</span>
            )}
          </div>

          {/* 4. Количество */}
          <div className="flex items-center space-x-2">
            <label htmlFor="qty" className="font-medium">
              Количество:
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={available || 1}
              value={qty}
              onChange={handleQtyChange}
              disabled={outOfStock || loading}
              className="w-20 border rounded px-2 py-1"
            />
            <span className="text-xs text-gray-500">макс: {available}</span>
          </div>

          {/* 5. Кнопка «В корзину» */}
          <button
            onClick={handleAdd}
            disabled={outOfStock || loading}
            className="
              relative flex items-center justify-center
              px-6 py-2
              bg-yellow-500 text-white rounded-lg
              disabled:bg-gray-400
              focus:outline-none focus:ring-4 focus:ring-yellow-300
              transition transform duration-200
              hover:scale-105
              active:scale-95 active:bg-yellow-600
            "
            type="button"
          >
            {loading && (
              <span
                className="absolute inset-0 m-auto h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            )}
            <span className={loading ? 'opacity-0' : ''}>
              {outOfStock ? 'Нет в наличии' : 'В корзину'}
            </span>
          </button>
        </>
      )}
    </div>
  )
}