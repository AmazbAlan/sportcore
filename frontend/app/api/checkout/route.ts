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
  productId?: number
  qty: number
  price?: number
  title?: string
}

type CheckoutBody = {
  items?: CartItem[]
  customer?: { name?: string; phone?: string; address?: string }
  total?: number
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as CheckoutBody
  const items = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    return NextResponse.json({ ok: false, message: 'items пустые' }, { status: 400 })
  }

  // 1) Загружаем ВСЕ нужные товары одним запросом, чтобы получить свежие qty/цены
  const slugs = items.map(i => (i.slug || '').trim()).filter(Boolean)
  if (slugs.length === 0) {
    return NextResponse.json({ ok: false, message: 'нет slug в items' }, { status: 400 })
  }
  const inList = slugs.map(s => `"${s}"`).join(',')
  const productsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/products?slug=in.(${encodeURIComponent(inList)})&select=id,slug,name,qty,price`,
    { headers: h, cache: 'no-store' }
  )
  if (!productsRes.ok) {
    return NextResponse.json({ ok: false, reason: `GET_${productsRes.status}` }, { status: 500 })
  }
  const dbProducts = (await productsRes.json()) as Array<{
    id: number; slug: string; name: string; qty: number; price: number
  }>
  const bySlug = new Map(dbProducts.map(p => [p.slug, p]))

  // 2) Проверяем остатки ПЕРЕД любыми изменениями
  const results: any[] = []
  for (const item of items) {
    const qty = Number(item.qty ?? 0)
    const slug = (item.slug ?? '').trim()
    if (!slug) { results.push({ ok: false, reason: 'MISSING_SLUG' }); continue }
    if (!Number.isFinite(qty) || qty <= 0) { results.push({ ok: false, reason: 'INVALID_QTY', slug }); continue }
    const p = bySlug.get(slug)
    if (!p) { results.push({ ok: false, reason: 'NOT_FOUND', slug }); continue }
    if (Number(p.qty) < qty) {
      results.push({ ok: false, reason: 'OUT_OF_STOCK', slug, have: p.qty, want: qty })
    } else {
      results.push({ ok: true, slug, productId: p.id, name: p.name, qty, price: p.price })
    }
  }

  // Если хотя бы один товар нельзя списать — отказываем во всём заказе
  const failed = results.filter(r => !r.ok)
  if (failed.length) {
    return NextResponse.json({ ok: false, results, message: 'Не все товары доступны' }, { status: 409 })
  }

  // 3) Создаём запись sales — чтобы заказ ПОЯВИЛСЯ в CRM
  const total = Number(body.total) || results.reduce((s, r) => s + (r.price * r.qty), 0)
  const customer = body.customer || {}
  const salePayload: any = { total }
  // Добавим инфо о клиенте, если в схеме есть колонки. Если их нет — Supabase вернёт ошибку,
  // тогда отправим минимальный payload.
  if (customer.name) salePayload.customer_name = customer.name
  if (customer.phone) salePayload.customer_phone = customer.phone
  if (customer.address) salePayload.customer_address = customer.address
  salePayload.source = 'site'

  let saleId: number | null = null
  let saleRes = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
    method: 'POST', headers: h, body: JSON.stringify(salePayload),
  })
  if (!saleRes.ok) {
    // Фоллбек: возможно нет колонок customer_*/source — попробуем только { total }
    saleRes = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
      method: 'POST', headers: h, body: JSON.stringify({ total }),
    })
  }
  if (saleRes.ok) {
    const saleData = await saleRes.json()
    saleId = saleData?.[0]?.id ?? null
  }

  // 4) Пишем sale_items
  if (saleId) {
    const saleItems = results.map(r => ({
      sale_id: saleId,
      product_id: r.productId,
      product_name: r.name,
      price: r.price,
      qty: r.qty,
    }))
    await fetch(`${SUPABASE_URL}/rest/v1/sale_items`, {
      method: 'POST', headers: h, body: JSON.stringify(saleItems),
    })
  }

  // 5) Списываем остатки — последовательно (минимизируем гонку, без транзакций просто иначе никак)
  const patchResults: any[] = []
  for (const r of results) {
    const p = bySlug.get(r.slug)!
    const newQty = Math.max(0, Number(p.qty) - r.qty)
    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`,
      { method: 'PATCH', headers: h, body: JSON.stringify({ qty: newQty }) }
    )
    patchResults.push({ slug: r.slug, ok: patchRes.ok, from: p.qty, to: newQty })
  }

  return NextResponse.json({ ok: true, saleId, results: patchResults })
}