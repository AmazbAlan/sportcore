// frontend/app/checkout/page.tsx
'use client'
import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const onSubmit = async () => {
    // Сформировать текст для WhatsApp
    const lines = [
      `Заказ от: ${name}`,
      `Телефон: ${phone}`,
      `Адрес: ${address}`,
      ``,
      `Заказ:`,
      ...items.map((i) => `- ${i.title} x${i.qty} (${i.price * i.qty} сом)`),
      ``,
      `Итого: ${total()} сом`,
    ]
    const text = encodeURIComponent(lines.join('\n'))

    // Обновить остатки в Strapi
    await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })

    // Очистить корзину
    clear()

    // Перенаправить в WhatsApp
    window.location.href = `https://wa.me/+996708201663/?text=${text}`
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">Оформление заказа</h1>
      <input
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        placeholder="Телефон (WhatsApp)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        placeholder="Адрес доставки"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <div>Итого: <strong>{total()} сом</strong></div>
      <button
        onClick={onSubmit}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Оформить заказ в WhatsApp
      </button>
    </main>
  )
}
