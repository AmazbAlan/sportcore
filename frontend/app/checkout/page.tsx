'use client'

import React, { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'

function formatSom(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalValue = useMemo(() => total(), [total])

  const canSubmit =
    items.length > 0 &&
    name.trim().length >= 2 &&
    address.trim().length >= 4 &&
    !isSubmitting

  const onSubmit = async () => {
    setError(null)

    if (items.length === 0) {
      setError('Корзина пустая.')
      return
    }
    if (name.trim().length < 2) {
      setError('Укажи имя (минимум 2 символа).')
      return
    }
    if (address.trim().length < 4) {
      setError('Укажи адрес доставки.')
      return
    }

    setIsSubmitting(true)

    try {
      const lines = [
        `Заказ от: ${name.trim()}`,
        `Телефон: ${phone.trim()}`,
        `Адрес: ${address.trim()}`,
        ``,
        `Заказ:`,
        ...items.map((i) => `- ${i.title} x${i.qty} (${i.price * i.qty} сом)`),
        ``,
        `Итого: ${totalValue} сом`,
      ]

      const text = encodeURIComponent(lines.join('\n'))

      // НЕ даём API сломать WhatsApp: если упадёт — всё равно откроем WA
      try {
        await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: { name: name.trim(), phone: phone.trim(), address: address.trim() },
            items,
            total: totalValue,
          }),
        })
      } catch (_) {}

      clear()

      window.location.href = `https://wa.me/+996774231202/?text=${text}`
    } catch (e: any) {
      setError(e?.message || 'Не удалось оформить заказ. Попробуй ещё раз.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-120px)] bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Форма */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Оформление заказа
                </h1>
                <p className="mt-1 text-slate-500">
                  Заполни данные — мы откроем WhatsApp с готовым заказом.
                </p>
              </div>

              <span className="hidden md:inline-flex items-center rounded-full bg-green-50 text-green-700 border border-green-200 px-3 py-1 text-sm">
                WhatsApp
              </span>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Имя</label>
                <input
                  placeholder="Например: Бексултан"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition
                             focus:border-slate-400 focus:ring-4 focus:ring-slate-100
                             disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Телефон (WhatsApp)</label>
                <input
                  placeholder="+996 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  inputMode="tel"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition
                             focus:border-slate-400 focus:ring-4 focus:ring-slate-100
                             disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Адрес доставки</label>
                <textarea
                  placeholder="Город, улица, дом, квартира"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition
                             focus:border-slate-400 focus:ring-4 focus:ring-slate-100
                             disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3 font-semibold text-white
                           bg-green-600 transition active:scale-[0.99]
                           hover:bg-green-700
                           disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="inline-block h-5 w-5 rounded-full border-2 border-white/60 border-t-white animate-spin"
                      aria-hidden="true"
                    />
                    Отправляем…
                  </>
                ) : (
                  'Оформить заказ в WhatsApp'
                )}
              </button>

              <p className="text-xs text-slate-500">
                Нажимая кнопку, ты перейдёшь в WhatsApp с заполненным текстом заказа.
              </p>
            </div>
          </section>

          {/* Сайдбар / Итог */}
          <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Ваш заказ</h2>
              <span className="text-sm text-slate-500">{items.length} поз.</span>
            </div>

            <div className="mt-4 space-y-3 max-h-[45vh] overflow-auto pr-1">
              {items.length === 0 ? (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-600">
                  Корзина пустая.
                </div>
              ) : (
                items.map((i) => (
                  <div
                    key={i.id ?? i.slug ?? i.title}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      {/* В 2 строки, чтобы не ломало мобилку */}
                      <div className="text-slate-900 font-medium overflow-hidden text-ellipsis line-clamp-2">
                        {i.title}
                      </div>

                      <div className="mt-1 text-sm text-slate-500 truncate">
                        {i.qty} × {formatSom(i.price)} сом
                      </div>
                    </div>

                    <div className="shrink-0 whitespace-nowrap font-semibold text-slate-900">
                      {formatSom(i.price * i.qty)} сом
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Итого</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatSom(totalValue)} сом
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}