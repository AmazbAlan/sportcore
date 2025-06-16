import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function POST(req: NextRequest) {
  const { items } = await req.json() as { items: { productId: number; qty: number }[] }

  // Уменьшаем остаток на Strapi
  await Promise.all(
    items.map(async ({ productId, qty }) => {
      // Берём текущий stock
      const p = await fetch(`${STRAPI_URL}/api/products/${productId}?populate=*`)
      const json = await p.json()
      const currentStock = json.data.attributes.stock || 0

      // Обновляем stock
      await fetch(`${STRAPI_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { stock: Math.max(0, currentStock - qty) } }),
      })
    })
  )

  return NextResponse.json({ ok: true })
}
