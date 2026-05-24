// frontend/app/context/CartContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react'

export interface CartItem {
  /** unique key combining product + variant */
  id: string
  productId: number
  variantId?: string | number | null // строковый id варианта в новой модели
  slug: string
  title: string
  price: number
  qty: number
  variantLabel?: string // "Размер: 42, Цвет: Чёрный"
  /** legacy поле, оставлено для обратной совместимости */
  color?: string
}

interface CartContextValue {
  items: CartItem[]
  add: (item: Omit<CartItem, 'id' | 'qty'>, qty?: number) => void
  update: (id: string, qty: number) => void
  remove: (id: string) => void
  total: () => number
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function makeCartKey(item: Omit<CartItem, 'id' | 'qty'>): string {
  // Уникальный ключ: productId + variantId (если есть)
  return `${item.productId}-${item.variantId ?? ''}-${item.color ?? ''}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (
    newItem: Omit<CartItem, 'id' | 'qty'>,
    qty: number = 1
  ) => {
    const id = makeCartKey(newItem)
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.id === id)
      if (idx >= 0) {
        const copy = [...cur]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty }
        return copy
      }
      return [...cur, { ...newItem, qty, id }]
    })
  }

  const update = (id: string, qty: number) => {
    setItems((cur) =>
      cur
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    )
  }

  const remove = (id: string) =>
    setItems((cur) => cur.filter((i) => i.id !== id))

  const clear = () => setItems([])

  const total = () =>
    items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, add, update, remove, total, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}