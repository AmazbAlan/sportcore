'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useCart } from '../../../app/context/CartContext'
import type { Product, VariantsConfig, VariantItem } from '../../../lib/api'

interface CartControlsProps {
  product: Product
}

export default function CartControls({ product }: CartControlsProps) {
  const { add } = useCart()
  const cfg: VariantsConfig | null = (product as any).variantsConfig ?? null
  const hasVariants = Boolean(cfg && cfg.attributes.length > 0 && cfg.items.length > 0)

  const [selected, setSelected] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Сброс выбора при смене товара
  useEffect(() => {
    setSelected({})
    setQty(1)
    setJustAdded(false)
  }, [product.id])

  // Возможные значения для каждого атрибута (с учётом уже выбранных значений других атрибутов)
  const optionsForAttribute = useMemo(() => {
    if (!cfg) return {}
    const result: Record<string, { value: string; stock: number; available: boolean }[]> = {}
    for (const attr of cfg.attributes) {
      const seen = new Map<string, { stock: number; available: boolean }>()
      for (const item of cfg.items) {
        const val = item.values[attr]
        if (!val) continue
        // Проверяем, что для этого значения существует комбинация с другими УЖЕ выбранными атрибутами
        const matchesOthers = cfg.attributes.every(otherAttr => {
          if (otherAttr === attr) return true
          if (!selected[otherAttr]) return true
          return item.values[otherAttr] === selected[otherAttr]
        })
        if (!matchesOthers) continue
        const prev = seen.get(val)
        const stock = (prev?.stock || 0) + Number(item.stock || 0)
        const available = Boolean(prev?.available || stock > 0)
        seen.set(val, { stock, available })
      }
      result[attr] = Array.from(seen.entries()).map(([value, info]) => ({
        value,
        stock: info.stock,
        available: info.available,
      }))
    }
    return result
  }, [cfg, selected])

  // Выбранный конкретный вариант (когда все атрибуты выбраны)
  const selectedItem: VariantItem | null = useMemo(() => {
    if (!cfg) return null
    if (cfg.attributes.length === 0) return null
    const allSelected = cfg.attributes.every(a => selected[a])
    if (!allSelected) return null
    return cfg.items.find(item =>
      cfg.attributes.every(a => item.values[a] === selected[a])
    ) || null
  }, [cfg, selected])

  // Состояние наличия и кнопки
  let inStock: boolean
  let stockHint: string
  if (hasVariants) {
    if (selectedItem) {
      inStock = (selectedItem.stock || 0) > 0
      stockHint = inStock ? 'В наличии' : 'Нет в наличии'
    } else {
      // Любой вариант со стоком > 0?
      const anyInStock = (cfg as VariantsConfig).items.some(it => (it.stock || 0) > 0)
      inStock = anyInStock
      stockHint = anyInStock ? 'В наличии' : 'Нет в наличии'
    }
  } else {
    inStock = (product.qty || 0) > 0
    stockHint = inStock ? 'В наличии' : 'Нет в наличии'
  }

  const allAttributesSelected = !hasVariants || (cfg && cfg.attributes.every(a => selected[a]))
  const currentPrice = selectedItem?.price ?? product.price

  const handleAdd = useCallback(async () => {
    if (!inStock || !allAttributesSelected) return
    setLoading(true)
    try {
      const variantLabel = hasVariants && cfg
        ? cfg.attributes.map(a => `${a}: ${selected[a]}`).join(', ')
        : ''
      const titleSuffix = variantLabel ? ` (${variantLabel})` : ''

      add(
        {
          productId: product.id,
          variantId: selectedItem?.id,
          slug: product.slug,
          title: `${product.title}${titleSuffix}`,
          price: currentPrice,
          variantLabel: variantLabel || undefined,
        } as any,
        qty
      )
      setJustAdded(true)
      window.setTimeout(() => setJustAdded(false), 1500)
    } finally {
      setLoading(false)
    }
  }, [add, product, selectedItem, qty, inStock, allAttributesSelected, hasVariants, cfg, selected, currentPrice])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm text-slate-500">Параметры</p>
          <p className="text-base font-semibold text-slate-900">
            {hasVariants ? 'Выберите вариант' : 'Готов к покупке'}
          </p>
        </div>
        <span
          className={[
            'rounded-full border px-3 py-1 text-xs font-medium',
            inStock
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200',
          ].join(' ')}
        >
          {stockHint}
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Атрибуты с кнопками */}
        {hasVariants && cfg && cfg.attributes.map((attr) => {
          const opts = optionsForAttribute[attr] || []
          return (
            <section key={attr} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{attr}</span>
                <span className="text-xs text-slate-500">
                  {selected[attr] ? `Выбрано: ${selected[attr]}` : 'Нажмите, чтобы выбрать'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {opts.map((opt) => {
                  const isActive = selected[attr] === opt.value
                  const disabled = !opt.available || loading
                  return (
                    <button
                      key={opt.value}
                      onClick={() => !disabled && setSelected(prev => ({ ...prev, [attr]: opt.value }))}
                      disabled={disabled}
                      type="button"
                      className={[
                        'rounded-xl border px-4 py-2 text-sm font-semibold transition',
                        'focus:outline-none focus:ring-4 focus:ring-yellow-200',
                        isActive
                          ? 'border-yellow-500 bg-yellow-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
                        disabled ? 'cursor-not-allowed opacity-50 line-through' : '',
                      ].join(' ')}
                      title={opt.available ? `${opt.value} (${opt.stock} шт)` : `${opt.value} — нет в наличии`}
                    >
                      {opt.value}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* Количество */}
        <section className="space-y-2">
          <div className="text-sm font-semibold text-slate-900">Количество</div>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-lg font-semibold hover:bg-slate-50"
              aria-label="Уменьшить"
            >−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="h-10 w-16 rounded-xl border border-slate-200 bg-white text-center text-base font-semibold"
            />
            <button
              type="button"
              onClick={() => setQty(q => q + 1)}
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-lg font-semibold hover:bg-slate-50"
              aria-label="Увеличить"
            >+</button>
          </div>
        </section>

        {/* Кнопка добавить */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock || !allAttributesSelected || loading}
          className={[
            'w-full rounded-xl px-5 py-3 text-base font-bold transition',
            inStock && allAttributesSelected
              ? 'bg-yellow-400 text-[#1a1f4b] hover:bg-yellow-300 active:scale-[0.99]'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed',
          ].join(' ')}
        >
          {justAdded
            ? '✓ Добавлено в корзину'
            : !allAttributesSelected
              ? `Выберите: ${(cfg?.attributes || []).filter(a => !selected[a]).join(', ')}`
              : !inStock
                ? 'Нет в наличии'
                : 'Добавить в корзину'}
        </button>
      </div>
    </div>
  )
}