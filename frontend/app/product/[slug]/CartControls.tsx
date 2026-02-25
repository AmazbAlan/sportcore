'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useCart } from '../../../app/context/CartContext'
import type { Product, ProductVariant, VariantColor } from '../../../lib/api'

interface CartControlsProps {
  product: Product
}

// ✅ Базовый URL Strapi (на проде должен быть NEXT_PUBLIC_STRAPI_URL)
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'https://sportcore-production.up.railway.app'

// ✅ Превращаем относительный url (/uploads/...) в абсолютный
function toAbsoluteUrl(url?: string | null) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (!url.startsWith('/')) return `${STRAPI_URL}/${url}`
  return `${STRAPI_URL}${url}`
}

// ✅ Достаём url из любых форматов Strapi media
function getStrapiMediaUrl(media: any): string {
  if (!media) return ''

  // 1) твой формат: [{ url: "..." }]
  if (Array.isArray(media) && media[0]?.url) {
    return toAbsoluteUrl(media[0].url)
  }

  // 2) Strapi multiple: { data: [{ attributes: { url } }] }
  if (Array.isArray(media?.data) && media.data[0]?.attributes?.url) {
    return toAbsoluteUrl(media.data[0].attributes.url)
  }

  // 3) Strapi single: { data: { attributes: { url } } }
  if (media?.data?.attributes?.url) {
    return toAbsoluteUrl(media.data.attributes.url)
  }

  // 4) если вдруг уже строка
  if (typeof media === 'string') {
    return toAbsoluteUrl(media)
  }

  return ''
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

  const available = variant?.stock ?? 0
  const outOfStock = available <= 0

  const handleVariantClick = (v: ProductVariant) => {
    if (loading) return
    setVariant(v)
    setColor(v.color?.[0] ?? null)
    setQty(1)
  }

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10) || 1
    setQty(Math.min(Math.max(1, v), available))
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
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVariantClick(v)}
                  disabled={v.stock === 0 || loading}
                  className={`
                    flex flex-col items-center justify-center
                    w-16 h-16 rounded-full border
                    ${variant.id === v.id ? 'border-yellow-500' : 'border-gray-300'}
                    ${v.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-500'}
                  `}
                >
                  <span className="text-sm font-medium">{v.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Цвет */}
          {variant.color?.length ? (
            <div>
              <span className="font-medium block mb-2">Цвет:</span>
              <div className="flex flex-wrap gap-3">
                {variant.color.map((c: VariantColor) => {
                  // ✅ теперь вытаскиваем url независимо от формата Strapi
                  const imageUrl = getStrapiMediaUrl((c as any).image)

                  return (
                    <button
                      key={c.name}
                      onClick={() => setColor(c)}
                      className={`
                        w-14 h-14 rounded-full border-2 overflow-hidden
                        flex items-center justify-center
                        ${color?.name === c.name ? 'border-yellow-500' : 'border-gray-300'}
                        hover:border-yellow-500
                      `}
                      title={c.name}
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
              max={available}
              value={qty}
              onChange={handleQtyChange}
              disabled={outOfStock || loading}
              className="w-20 border rounded px-2 py-1"
            />
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