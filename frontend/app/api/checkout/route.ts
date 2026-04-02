import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const h = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  Prefer: 'return=representation',
}

type CartItem = {
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

      if (!slug) return { ok: false, reason: 'MISSING_SLUG', item }
      if (!Number.isFinite(qty) || qty <= 0) return { ok: false, reason: 'INVALID_QTY', slug }

      // 1) Найти товар по slug
      const getRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&select=id,qty`,
        { headers: h }
      )
      if (!getRes.ok) return { ok: false, reason: `GET_${getRes.status}`, slug }

      const products = await getRes.json()
      const product = products[0]
      if (!product) return { ok: false, reason: 'NOT_FOUND', slug }

      const newQty = Math.max(0, Number(product.qty) - qty)

      // 2) Обновить остаток
      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`,
        {
          method: 'PATCH',
          headers: h,
          body: JSON.stringify({ qty: newQty }),
        }
      )

      if (!patchRes.ok) return { ok: false, reason: `PATCH_${patchRes.status}`, slug }

      return { ok: true, slug, from: product.qty, to: newQty }
    })
  )

  return NextResponse.json({ ok: true, results })
}
