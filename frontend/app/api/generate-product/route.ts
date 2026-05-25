import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://sportcore-crm.vercel.app',
  'http://localhost:3000',
  'file://',
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

// Нативный Gemini API — как в chat route (стабильнее OpenAI прокси)
const MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o))
  return {
    'Access-Control-Allow-Origin': allowed ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

async function fetchCategories(): Promise<Array<{ name: string; slug: string }>> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=name,slug&order=name.asc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }, next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function fetchExistingSlugs(name: string): Promise<string[]> {
  try {
    const encoded = encodeURIComponent(`%${name.slice(0, 6)}%`)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug&name=ilike.${encoded}&limit=20`,
      { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }, cache: 'no-store' }
    )
    if (!res.ok) return []
    const rows: Array<{ slug: string }> = await res.json()
    return rows.map(r => r.slug).filter(Boolean)
  } catch { return [] }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const body = await req.json().catch(() => ({}))
  const { name, price } = body

  if (!name) {
    return NextResponse.json({ error: 'name обязателен' }, { status: 400, headers: corsHeaders(origin) })
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY не настроен' }, { status: 500, headers: corsHeaders(origin) })
  }

  const [categories, existingSlugs] = await Promise.all([
    fetchCategories(),
    fetchExistingSlugs(String(name)),
  ])

  const categoriesBlock = categories.length > 0
    ? categories.map(c => `- ${c.slug} — ${c.name}`).join('\n')
    : `- aksessuary\n- inventar\n- odezhda\n- obuv\n- pitanie\n- drugoe`

  const slugWarning = existingSlugs.length > 0
    ? `\n\nЭти slug уже ЗАНЯТЫ — НЕ используй их:\n${existingSlugs.slice(0, 10).map(s => `- ${s}`).join('\n')}`
    : ''

  const prompt = `Заполни карточку товара для спортивного магазина SPORTCORE в Бишкеке.

Товар: "${name}"
Цена: ${price || 0} сом

КАТЕГОРИИ (используй ТОЛЬКО один из этих slug):
${categoriesBlock}${slugWarning}

Верни СТРОГО один JSON объект — без markdown, без \`\`\`, без пояснений. Начни с { и закончи }:
{"slug":"transliteratsiya-nazvaniia","category_slug":"odin-iz-slug-vyshe","description":"2-3 predlozheniya na russkom","seo_title":"Kupitj ... v Bishkeke | SPORTCORE","seo_desc":"Kupitj ... po tsene ${price || 0} som...","featured":false}

Правила:
- slug: только латиница+цифры+дефисы, транслит. "Аппликатор Кузнецова" → "applikator-kuznetsova"
- category_slug: ТОЧНО один из slug списка выше
- description: 2-3 предложения на русском
- seo_title: до 60 символов
- seo_desc: до 155 символов`

  const geminiBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 600,
    },
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    console.error('Gemini generate-product error:', response.status, errText.slice(0, 300))
    return NextResponse.json(
      { error: `Gemini ${response.status}` },
      { status: 500, headers: corsHeaders(origin) }
    )
  }

  const data = await response.json()
  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  console.log('Gemini raw for', name, ':', raw.slice(0, 200))

  if (!raw) {
    console.error('Gemini empty response:', JSON.stringify(data).slice(0, 300))
    return NextResponse.json({ error: 'empty response' }, { status: 500, headers: corsHeaders(origin) })
  }

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('no JSON in response')

    // Берём первый валидный объект
    let parsed: any = null
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      // JSON обрезан — ищем по закрывающей скобке
      let depth = 0, end = -1
      for (let i = 0; i < jsonMatch[0].length; i++) {
        if (jsonMatch[0][i] === '{') depth++
        if (jsonMatch[0][i] === '}') { depth--; if (depth === 0) { end = i; break } }
      }
      if (end > 0) parsed = JSON.parse(jsonMatch[0].slice(0, end + 1))
    }

    if (!parsed) throw new Error('parse failed')

    // Валидация category_slug
    if (categories.length > 0 && parsed.category_slug) {
      const validSlugs = new Set(categories.map(c => c.slug))
      if (!validSlugs.has(parsed.category_slug)) {
        console.warn(`Неверная категория: "${parsed.category_slug}", сбрасываем`)
        parsed.category_slug = categories[0]?.slug || ''
      }
    }

    return NextResponse.json(parsed, { headers: corsHeaders(origin) })
  } catch (e: any) {
    console.error('Parse error:', e.message, '| raw:', raw.slice(0, 300))
    return NextResponse.json(
      { error: 'parse error', raw: raw.slice(0, 200) },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}