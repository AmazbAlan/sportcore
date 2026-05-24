import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://sportcore-crm.vercel.app',
  'http://localhost:3000',
  'file://',
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

// Загружаем реальные категории из БД (кэшируем на 5 мин)
async function fetchCategories(): Promise<Array<{ name: string; slug: string }>> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=name,slug&order=name.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
        },
        next: { revalidate: 300 }, // 5 минут
      }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Также загружаем slug существующих товаров, чтобы ИИ не генерировал дубликаты
async function fetchExistingSlugs(name: string): Promise<string[]> {
  try {
    // Берём похожие по имени товары + несколько последних, чтобы slug точно был уникальным
    const encoded = encodeURIComponent(`%${name.slice(0, 6)}%`)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug&name=ilike.${encoded}&limit=20`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
        },
        cache: 'no-store',
      }
    )
    if (!res.ok) return []
    const rows: Array<{ slug: string }> = await res.json()
    return rows.map(r => r.slug).filter(Boolean)
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const body = await req.json().catch(() => ({}))
  const { name, price } = body

  if (!name) {
    return NextResponse.json({ error: 'name обязателен' }, { status: 400, headers: corsHeaders(origin) })
  }

  // Загружаем реальные категории и существующие slug параллельно
  const [categories, existingSlugs] = await Promise.all([
    fetchCategories(),
    fetchExistingSlugs(String(name)),
  ])

  // Формируем строку категорий для промпта
  const categoriesBlock = categories.length > 0
    ? categories.map(c => `- ${c.slug} — ${c.name}`).join('\n')
    : `- aksessuary\n- inventar\n- odezhda\n- obuv\n- pitanie\n- drugoe`

  const slugWarning = existingSlugs.length > 0
    ? `\n\nЭти slug уже ЗАНЯТЫ в БД — НЕ используй их:\n${existingSlugs.slice(0, 10).map(s => `- ${s}`).join('\n')}`
    : ''

  const prompt = `Ты заполняешь карточку товара для спортивного магазина SPORTCORE в Бишкеке (Кыргызстан).

Товар: "${name}"
Цена: ${price || 0} сом

РЕАЛЬНЫЕ КАТЕГОРИИ МАГАЗИНА (используй ТОЛЬКО slug из этого списка, выбери наиболее подходящую):
${categoriesBlock}${slugWarning}

Верни ТОЛЬКО валидный JSON без лишнего текста, без markdown блоков:
{
  "slug": "url-slug-latinitsey-cherez-defis",
  "category_slug": "один из slug выше",
  "description": "Продающее описание 2-3 предложения. Материал, применение, преимущества.",
  "seo_title": "Купить [название] в Бишкеке | SPORTCORE",
  "seo_desc": "Купить [название] в Бишкеке по цене ${price || 0} сом. [преимущество]. Доставка по Кыргызстану. SPORTCORE",
  "featured": false
}

Правила:
- slug: только латиница, цифры, дефисы. Транслит русского + ключевые слова. "Кроссовки Nike" → "krossovki-nike", "МФР ролл 33 см" → "mfr-roll-33-sm"
- category_slug должен ТОЧНО совпадать с одним из slug в списке выше — не придумывай новые
- description: 2-3 предложения на русском, без воды
- seo_title: до 60 символов
- seo_desc: до 155 символов`

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content: 'Ты генерируешь данные для товарных карточек. Отвечай ТОЛЬКО валидным JSON без markdown, без ```json, без пояснений.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 600,
    }),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    console.error('Groq error:', response.status, errText)
    return NextResponse.json(
      { error: `Groq ${response.status}` },
      { status: 500, headers: corsHeaders(origin) }
    )
  }

  const data = await response.json()
  const raw: string = data?.choices?.[0]?.message?.content || '{}'

  // Убираем возможные ```json обёртки
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)

  try {
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    // Валидация: если category_slug не из списка реальных — сбрасываем в пустую строку
    // (CRM покажет что нужно заполнить руками)
    if (categories.length > 0 && result.category_slug) {
      const validSlugs = new Set(categories.map(c => c.slug))
      if (!validSlugs.has(result.category_slug)) {
        console.warn(`ИИ вернул неверную категорию: "${result.category_slug}". Сбрасываем.`)
        result.category_slug = ''
      }
    }

    return NextResponse.json(result, { headers: corsHeaders(origin) })
  } catch (e) {
    console.error('JSON parse error, raw:', raw)
    return NextResponse.json(
      { error: 'Parse error', raw: raw.slice(0, 200) },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}