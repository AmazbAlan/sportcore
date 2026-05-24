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
  variantId?: string | null
  variantLabel?: string
  qty: number
  price?: number
  title?: string
}

type CheckoutBody = {
  items?: CartItem[]
  customer?: { name?: string; phone?: string; address?: string }
  total?: number
}

type VariantsConfig = {
  attributes: string[]
  items: Array<{ id: string; values: Record<string, string>; stock: number; image_url?: string | null; price?: number | null }>
}

function variantLabel(cfg: VariantsConfig | null, variantId: string | null | undefined): string {
  if (!cfg || !variantId) return ''
  const item = cfg.items.find(it => it.id === variantId)
  if (!item) return ''
  return cfg.attributes.map(a => `${a}: ${item.values[a] || '—'}`).join(', ')
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as CheckoutBody
  const items = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    return NextResponse.json({ ok: false, message: 'items пустые' }, { status: 400 })
  }

  // 1) Загружаем нужные товары одним запросом, с variants
  const slugs = items.map(i => (i.slug || '').trim()).filter(Boolean)
  if (slugs.length === 0) {
    return NextResponse.json({ ok: false, message: 'нет slug в items' }, { status: 400 })
  }
  const inList = slugs.map(s => `"${s}"`).join(',')
  const productsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/products?slug=in.(${encodeURIComponent(inList)})&select=id,slug,name,qty,price,variants`,
    { headers: h, cache: 'no-store' }
  )
  if (!productsRes.ok) {
    return NextResponse.json({ ok: false, reason: `GET_${productsRes.status}` }, { status: 500 })
  }
  const dbProducts = (await productsRes.json()) as Array<{
    id: number; slug: string; name: string; qty: number; price: number; variants: any
  }>
  const bySlug = new Map(dbProducts.map(p => [p.slug, p]))

  // Нормализация variants
  const normVariants = (raw: any): VariantsConfig | null => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    if (!Array.isArray(raw.attributes) || !Array.isArray(raw.items)) return null
    if (raw.attributes.length === 0 || raw.items.length === 0) return null
    return {
      attributes: raw.attributes.map(String),
      items: raw.items.map((it: any, i: number) => ({
        id: String(it?.id || `v${i + 1}`),
        values: it?.values || {},
        stock: Number(it?.stock ?? 0),
        image_url: it?.image_url || null,
        price: it?.price != null ? Number(it.price) : null,
      })),
    }
  }

  // 2) Проверка ВСЕХ позиций ПЕРЕД любыми изменениями
  const results: any[] = []
  for (const item of items) {
    const qty = Number(item.qty ?? 0)
    const slug = (item.slug ?? '').trim()
    if (!slug) { results.push({ ok: false, reason: 'MISSING_SLUG' }); continue }
    if (!Number.isFinite(qty) || qty <= 0) { results.push({ ok: false, reason: 'INVALID_QTY', slug }); continue }
    const p = bySlug.get(slug)
    if (!p) { results.push({ ok: false, reason: 'NOT_FOUND', slug }); continue }

    const cfg = normVariants(p.variants)

    if (cfg) {
      // У товара есть варианты — нужно знать какой именно
      const vId = item.variantId
      if (!vId) {
        results.push({ ok: false, reason: 'VARIANT_REQUIRED', slug, name: p.name })
        continue
      }
      const vItem = cfg.items.find(v => v.id === vId)
      if (!vItem) {
        results.push({ ok: false, reason: 'VARIANT_NOT_FOUND', slug, name: p.name, variantId: vId })
        continue
      }
      if ((Number(vItem.stock) || 0) < qty) {
        results.push({ ok: false, reason: 'OUT_OF_STOCK', slug, name: p.name, variantLabel: variantLabel(cfg, vId), have: vItem.stock, want: qty })
      } else {
        const itemPrice = vItem.price != null ? vItem.price : Number(p.price)
        results.push({
          ok: true, slug, productId: p.id, name: p.name, qty,
          price: itemPrice, variantId: vId,
          variantLabel: variantLabel(cfg, vId),
          _cfg: cfg, // понадобится при списании
        })
      }
    } else {
      // Простой товар без вариантов
      if (Number(p.qty) < qty) {
        results.push({ ok: false, reason: 'OUT_OF_STOCK', slug, name: p.name, have: p.qty, want: qty })
      } else {
        results.push({
          ok: true, slug, productId: p.id, name: p.name, qty,
          price: Number(p.price), variantId: null, variantLabel: '',
          _cfg: null,
        })
      }
    }
  }

  // Если хотя бы один товар нельзя списать — отказываем во всём заказе
  const failed = results.filter(r => !r.ok)
  if (failed.length) {
    return NextResponse.json({ ok: false, results, message: 'Не все товары доступны' }, { status: 409 })
  }

  // 3) Создаём sale (чтобы заказ ПОЯВИЛСЯ в CRM)
  const total = Number(body.total) || results.reduce((s, r) => s + (r.price * r.qty), 0)
  const customer = body.customer || {}
  const salePayload: any = { total, source: 'site' }
  if (customer.name) salePayload.customer_name = customer.name
  if (customer.phone) salePayload.customer_phone = customer.phone
  if (customer.address) salePayload.customer_address = customer.address

  let saleId: number | null = null
  let saleRes = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
    method: 'POST', headers: h, body: JSON.stringify(salePayload),
  })
  if (!saleRes.ok) {
    saleRes = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
      method: 'POST', headers: h, body: JSON.stringify({ total }),
    })
  }
  if (saleRes.ok) {
    const saleData = await saleRes.json()
    saleId = saleData?.[0]?.id ?? null
  }

  // 4) Пишем sale_items с variant_id и variant_label
  if (saleId) {
    const saleItems = results.map(r => ({
      sale_id: saleId,
      product_id: r.productId,
      product_name: r.name,
      price: r.price,
      qty: r.qty,
      variant_id: r.variantId || null,
      variant_label: r.variantLabel || null,
    }))
    await fetch(`${SUPABASE_URL}/rest/v1/sale_items`, {
      method: 'POST', headers: h, body: JSON.stringify(saleItems),
    })
  }

  // 5) Списываем остатки — с учётом вариантов
  const patchResults: any[] = []
  // Группируем по productId — чтобы один PATCH на товар обновил variants и qty
  const byProduct = new Map<number, any[]>()
  for (const r of results) {
    if (!byProduct.has(r.productId)) byProduct.set(r.productId, [])
    byProduct.get(r.productId)!.push(r)
  }

  for (const [productId, prodResults] of byProduct.entries()) {
    const p = bySlug.get(prodResults[0].slug)!
    const cfg = prodResults[0]._cfg as VariantsConfig | null

    if (cfg) {
      // Перечитываем актуальные variants (вдруг кто-то параллельно купил)
      const fresh = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=variants,qty`,
        { headers: h, cache: 'no-store' }
      )
      if (!fresh.ok) { patchResults.push({ productId, ok: false, error: 'GET_FAILED' }); continue }
      const freshData = await fresh.json()
      const freshCfg = normVariants(freshData?.[0]?.variants)
      if (!freshCfg) { patchResults.push({ productId, ok: false, error: 'VARIANTS_GONE' }); continue }

      // Применяем списания
      for (const r of prodResults) {
        const vi = freshCfg.items.find(v => v.id === r.variantId)
        if (vi) vi.stock = Math.max(0, Number(vi.stock) - r.qty)
      }
      const newQty = freshCfg.items.reduce((s, v) => s + (Number(v.stock) || 0), 0)
      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`,
        { method: 'PATCH', headers: h, body: JSON.stringify({ variants: freshCfg, qty: newQty }) }
      )
      patchResults.push({ productId, ok: patchRes.ok, newQty })
    } else {
      // Простой товар — обычное списание
      const totalDelta = prodResults.reduce((s, r) => s + r.qty, 0)
      const newQty = Math.max(0, Number(p.qty) - totalDelta)
      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`,
        { method: 'PATCH', headers: h, body: JSON.stringify({ qty: newQty }) }
      )
      patchResults.push({ productId, ok: patchRes.ok, from: p.qty, to: newQty })
    }
  }

  return NextResponse.json({ ok: true, saleId, results: patchResults })
}