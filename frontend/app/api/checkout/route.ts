import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = (process.env.STRAPI_URL || 'https://sportcore-production.up.railway.app')
  .replace(/\/+$/, '')

type CartItem = {
  productId?: number
  slug?: string
  qty: number
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { items?: CartItem[] }
  const items = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    return NextResponse.json({ ok: false, message: 'items пустые' }, { status: 400 })
  }

  const results = await Promise.all(
    items.map(async (item) => {
      const qty = Number(item.qty ?? 0)
      const slug = (item.slug ?? '').trim()

      if (!slug) {
        console.error('Missing slug in cart item:', item)
        return { ok: false, reason: 'MISSING_SLUG', item }
      }
      if (!Number.isFinite(qty) || qty <= 0) {
        console.error('Invalid qty:', item)
        return { ok: false, reason: 'INVALID_QTY', slug, qty }
      }

      // 1) Ищем товар по slug
      const getUrl =
        `${STRAPI_URL}/api/products` +
        `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
        `&populate=*`

      const getRes = await fetch(getUrl)

      if (!getRes.ok) {
        const text = await getRes.text().catch(() => '')
        console.error('STRAPI GET(by slug) failed', { slug, status: getRes.status, text })
        return { ok: false, reason: `GET_${getRes.status}`, slug }
      }

      const json: any = await getRes.json().catch(() => null)
      const product = json?.data?.[0]

      if (!product?.id || !product?.attributes) {
        console.error('Product not found by slug or invalid response', { slug, json })
        return { ok: false, reason: 'NOT_FOUND', slug }
      }

      const realId = Number(product.id)
      const currentStock = Number(product.attributes.stock ?? 0)

      // 2) Обновляем stock по реальному id
      const putRes = await fetch(`${STRAPI_URL}/api/products/${realId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { stock: Math.max(0, currentStock - qty) },
        }),
      })

      if (!putRes.ok) {
        const text = await putRes.text().catch(() => '')
        console.error('STRAPI PUT failed', { slug, realId, status: putRes.status, text })
        return { ok: false, reason: `PUT_${putRes.status}`, slug, realId }
      }

      return { ok: true, slug, realId, from: currentStock, to: Math.max(0, currentStock - qty) }
    })
  )

  return NextResponse.json({ ok: true, results })
}