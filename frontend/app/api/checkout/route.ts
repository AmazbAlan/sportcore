import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = (process.env.STRAPI_URL || 'https://sportcore-production.up.railway.app').replace(/\/+$/, '')

export async function POST(req: NextRequest) {
  const { items } = (await req.json()) as { items: { productId: number; qty: number }[] }

  const results = await Promise.all(
    items.map(async ({ productId, qty }) => {
      const url = `${STRAPI_URL}/api/products/${productId}?populate=*`
      const p = await fetch(url)

      if (!p.ok) {
        const text = await p.text().catch(() => '')
        console.error('STRAPI GET failed', { productId, status: p.status, text })
        return { productId, ok: false, reason: `GET ${p.status}` }
      }

      const json = await p.json().catch(() => null)
      if (!json?.data?.attributes) {
        console.error('STRAPI returned null data', { productId, json })
        return { productId, ok: false, reason: 'data null' }
      }

      const currentStock = Number(json.data.attributes.stock ?? 0)

      const put = await fetch(`${STRAPI_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { stock: Math.max(0, currentStock - qty) } }),
      })

      if (!put.ok) {
        const text = await put.text().catch(() => '')
        console.error('STRAPI PUT failed', { productId, status: put.status, text })
        return { productId, ok: false, reason: `PUT ${put.status}` }
      }

      return { productId, ok: true }
    })
  )

  // чтобы фронт видел, что часть товаров не обновилась (но без 500)
  return NextResponse.json({ ok: true, results })
}
