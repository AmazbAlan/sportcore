import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Нативный Gemini API — надёжнее чем OpenAI-совместимый прокси
const MODEL = 'gemini-2.5-flash-lite'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
}

// Параллельная загрузка товаров и категорий с таймаутом
async function fetchWithTimeout(url: string, timeout = 4000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { headers: sbHeaders, signal: controller.signal, cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}

function extractDesc(raw: any): string {
  if (!raw) return ''
  if (typeof raw === 'string') return raw.slice(0, 120)
  if (Array.isArray(raw)) {
    return raw.map((b: any) =>
      (b?.children || []).map((c: any) => c?.text || '').join(' ')
    ).join(' ').trim().slice(0, 120)
  }
  return ''
}

function findRelevantProducts(products: any[], query: string, max = 25): any[] {
  if (!products.length) return []
  if (!query.trim()) return products.slice(0, max)

  const words = query.toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)

  if (!words.length) return products.slice(0, max)

  const scored = products.map(p => {
    const haystack = [
      p.name,
      p.category_slug,
      extractDesc(p.description),
      extractDesc(p.seo_desc)
    ].join(' ').toLowerCase()

    let score = 0
    for (const word of words) {
      if (haystack.includes(word)) score += 3
      if (word.length >= 4 && haystack.includes(word.slice(0, 4))) score += 1
    }
    return { p, score }
  })

  const relevant = scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(x => x.p)

  return relevant.length > 0 ? relevant : products.slice(0, max)
}

function getUserContext(messages: any[]): string {
  return messages
    .filter(m => m.role === 'user')
    .slice(-4)
    .map(m => m.content)
    .join(' ')
}

// Случайные заглушки — вместо одного скучного сообщения
const fallbackMessages = [
  { message: 'Что-то пошло не так с ответом 🙈 Попробуй переспросить или напиши нам в WhatsApp — ответим быстро!', label: 'Написать в WhatsApp' },
  { message: 'Не смог обработать запрос, извини! Напиши нам напрямую и мы поможем подобрать товар.', label: 'Написать в WhatsApp' },
  { message: 'Упс, что-то сломалось 😅 Лучше напиши нам в WhatsApp — там точно ответят!', label: 'Открыть WhatsApp' },
]

function randomFallback() {
  const fb = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
  return NextResponse.json({
    message: fb.message,
    action: { type: 'navigate', url: 'https://api.whatsapp.com/send?phone=996774231202&text=Здравствуйте', label: fb.label }
  })
}

const MAX_HISTORY = 6

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const messages: any[] = Array.isArray(body.messages) ? body.messages : []

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY не задан')
      return NextResponse.json({
        message: 'Ассистент временно недоступен. Напиши нам в WhatsApp!',
        action: { type: 'navigate', url: 'https://api.whatsapp.com/send?phone=996774231202', label: 'Написать в WhatsApp' }
      })
    }

    // Параллельная загрузка данных
    const [products, categories] = await Promise.all([
      fetchWithTimeout(`${SUPABASE_URL}/rest/v1/products?select=name,price,slug,category_slug,description,seo_desc&qty=gt.0&order=name.asc`),
      fetchWithTimeout(`${SUPABASE_URL}/rest/v1/categories?select=name,slug&order=name.asc`),
    ])

    const userContext = getUserContext(messages)
    const relevantProducts = findRelevantProducts(products, userContext)
    const totalInStock = products.length

    const categoryList = (categories as any[])
      .map((c: any) => `${c.name} → /category/${c.slug}`)
      .join('\n')

    const productList = relevantProducts
      .map((p: any) => {
        const desc = extractDesc(p.description) || extractDesc(p.seo_desc)
        return `• ${p.name} — ${p.price} сом [/product/${p.slug}]${desc ? ` (${desc})` : ''}`
      })
      .join('\n')

    const systemPrompt = `Ты Макс — дружелюбный консультант спортивного магазина SPORTCORE в Бишкеке. Говоришь как живой человек: тепло, по делу, иногда с лёгким юмором. Не используешь канцелярит и сухие формулировки.

ТОВАРЫ В НАЛИЧИИ (${totalInStock} позиций, показаны релевантные):
${productList || 'Товары загружаются, попробуй ещё раз'}

КАТЕГОРИИ:
${categoryList || '—'}

КОНТАКТЫ:
• WhatsApp: https://api.whatsapp.com/send?phone=996774231202
• Instagram: @sportcore.kg
• Адрес: Бишкек, ТРЦ Ала-Арча, 2 этаж

ПРАВИЛА:
1. Рекомендуй ТОЛЬКО товары из списка выше. Если нужного нет — честно скажи и предложи ближайшее
2. Отвечай кратко — 2-3 предложения максимум
3. Всегда отвечай на русском

ФОРМАТ ОТВЕТА — строго JSON, без markdown, без \`\`\`:
{"message": "текст ответа", "action": null}

Если хочешь дать ссылку на товар или категорию:
{"message": "текст", "action": {"type": "navigate", "url": "/product/slug-товара", "label": "Название кнопки"}}

Ссылки пиши ТОЛЬКО в action.url, не в message.`

    // Формируем историю в формате Gemini
    const history = messages.slice(-MAX_HISTORY).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content || '') }],
    }))

    // Последнее сообщение должно быть от user
    const lastUserMsg = [...history].reverse().find(m => m.role === 'user')
    if (!lastUserMsg) return randomFallback()

    // Убираем последний user из истории (он идёт отдельно как contents)
    const historyWithoutLast = history.slice(0, -1)

    const geminiBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...historyWithoutLast,
        { role: 'user', parts: [{ text: lastUserMsg.parts[0].text }] },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300,
        responseMimeType: 'application/json', // просим JSON напрямую
      },
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error(`Gemini API error ${response.status}:`, errText.slice(0, 500))
      return randomFallback()
    }

    const data = await response.json()
    const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (!raw) {
      console.error('Gemini пустой ответ:', JSON.stringify(data).slice(0, 300))
      return randomFallback()
    }

    // Парсим JSON из ответа
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/,'').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      if (!parsed?.message) {
        return NextResponse.json({ message: cleaned, action: null })
      }
      return NextResponse.json({
        message: parsed.message,
        action: parsed.action ?? null,
      })
    } catch {
      // Gemini вернул не JSON — показываем как текст
      return NextResponse.json({ message: raw.slice(0, 400), action: null })
    }

  } catch (err: any) {
    console.error('Chat route crash:', err?.message || err)
    return randomFallback()
  }
}