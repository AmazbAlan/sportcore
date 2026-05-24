import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Gemini через OpenAI-совместимый endpoint (никакого SDK не нужно)
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const MODEL = 'gemini-2.5-flash-lite'

const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
}

async function fetchProducts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=name,price,slug,category_slug,description,seo_desc&qty=gt.0&order=name.asc`,
      { headers: sbHeaders, next: { revalidate: 120 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function fetchCategories() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=name,slug&order=name.asc`,
      { headers: sbHeaders, next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

function extractDesc(raw: any): string {
  if (!raw) return ''
  if (typeof raw === 'string') return raw.slice(0, 100)
  if (Array.isArray(raw)) {
    return raw.map((b: any) =>
      (b?.children || []).map((c: any) => c?.text || '').join(' ')
    ).join(' ').trim().slice(0, 100)
  }
  return ''
}

// Простой поиск по релевантности — находим товары, подходящие к запросу
// Это главное улучшение: вместо 200 товаров в промпте — только 15-20 релевантных
function findRelevantProducts(products: any[], query: string, max = 20): any[] {
  if (!products.length || !query) return products.slice(0, max)

  const words = query.toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)

  if (!words.length) return products.slice(0, max)

  const scored = products.map(p => {
    const haystack = [p.name, p.category_slug, extractDesc(p.description), extractDesc(p.seo_desc)]
      .join(' ').toLowerCase()

    let score = 0
    for (const word of words) {
      if (haystack.includes(word)) score += 2
      // Частичное совпадение (первые 4 буквы) — для русской морфологии
      if (word.length >= 4 && haystack.includes(word.slice(0, 4))) score += 1
    }
    return { p, score }
  })

  // Возвращаем топ-20 по релевантности, с порогом > 0
  const relevant = scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(x => x.p)

  // Если ничего не нашли — возвращаем первые N (общий список)
  return relevant.length > 0 ? relevant : products.slice(0, max)
}

// Извлекаем текст последних сообщений пользователя для поиска
function getUserContext(messages: any[]): string {
  return messages
    .filter(m => m.role === 'user')
    .slice(-3) // последние 3 сообщения пользователя
    .map(m => m.content)
    .join(' ')
}

const MAX_HISTORY = 8

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { message: 'API ключ не настроен. Добавь GEMINI_API_KEY в переменные окружения Vercel.', action: null },
        { status: 200 }
      )
    }

    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])

    // Поиск только релевантных товаров под запрос пользователя
    const userContext = getUserContext(messages)
    const relevantProducts = findRelevantProducts(products, userContext)

    const categoryList = categories
      .map((c: any) => `- ${c.name} (slug: ${c.slug})`)
      .join('\n')

    const productList = relevantProducts
      .map((p: any) => {
        const desc = extractDesc(p.description) || extractDesc(p.seo_desc)
        return `- ${p.name} | ${p.price} сом | slug: ${p.slug}${desc ? ' | ' + desc : ''}`
      })
      .join('\n')

    const totalInStock = products.length

    const systemPrompt = `Ты — консультант интернет-магазина спортивных товаров SPORTCORE в Бишкеке.

ВАЖНО: рекомендуй ТОЛЬКО товары из списка ниже — это реальные товары в наличии. Всего в магазине ${totalInStock} товаров. Если нужного нет в списке — честно скажи и предложи похожее.

КАТЕГОРИИ:
${categoryList || '—'}

ПОДХОДЯЩИЕ ТОВАРЫ (название | цена | slug | описание):
${productList || 'По запросу ничего не найдено'}

КОНТАКТЫ:
- WhatsApp: +996 774 23 12 02
- Instagram: sportcore.kg  
- Адрес: Бишкек, пр. Ч. Айтматова 299в, ТРЦ Ала-Арча, 2 этаж

НАВИГАЦИЯ (использовать в action.url):
- Каталог: /category, Корзина: /cart, FAQ: /faq
- Товар: /product/SLUG, Категория: /category/SLUG
- Поиск: /search?query=ЗАПРОС
- WhatsApp: https://api.whatsapp.com/send?phone=996774231202

Отвечай ТОЛЬКО валидным JSON без markdown:
{"message": "ответ", "action": null}
или с навигацией:
{"message": "ответ", "action": {"type": "navigate", "url": "/product/slug", "label": "Название"}}

Правила: отвечай по-русски, тепло и кратко (2-3 предложения). Рекомендуй только товары из списка. Пути не пиши в message.`

    const trimmedHistory = messages.slice(-MAX_HISTORY)

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...trimmedHistory.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.4,
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      const err = await response.text().catch(() => '')
      console.error('Gemini error:', response.status, err)
      // Возвращаем статус ошибки в сообщении для отладки (уберём после исправления)
      const debugMsg = process.env.NODE_ENV === 'development'
        ? `Gemini ${response.status}: ${err.slice(0, 200)}`
        : 'Сейчас небольшие технические неполадки. Напиши нам напрямую!'
      return NextResponse.json({
        message: debugMsg,
        action: { type: 'navigate', url: 'https://api.whatsapp.com/send?phone=996774231202', label: 'Написать в WhatsApp' }
      })
    }

    const data = await response.json()
    const raw: string = data?.choices?.[0]?.message?.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    try {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      return NextResponse.json({
        message: parsed?.message ?? cleaned,
        action: parsed?.action ?? null,
      })
    } catch {
      return NextResponse.json({ message: cleaned || raw, action: null })
    }

  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({
      message: 'Что-то пошло не так. Напиши нам в WhatsApp, ответим быстро!',
      action: { type: 'navigate', url: 'https://api.whatsapp.com/send?phone=996774231202', label: 'Написать в WhatsApp' }
    })
  }
}