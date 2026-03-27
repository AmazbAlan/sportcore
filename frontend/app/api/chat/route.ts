// frontend/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337'

async function fetchProducts() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/products?populate[0]=image&populate[1]=category&populate[2]=variants&pagination[pageSize]=100`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data ?? []).map((entry: any) => {
      const raw = entry?.attributes ?? entry ?? {}
      return {
        title: raw.title ?? '',
        price: raw.price ?? 0,
        slug: raw.slug ?? '',
        category: raw.category?.data?.attributes?.slug ?? raw.category?.slug ?? '',
      }
    })
  } catch {
    return []
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/categories?sort=name:asc`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data ?? []).map((entry: any) => {
      const raw = entry?.attributes ?? entry ?? {}
      return { name: raw.name ?? '', slug: raw.slug ?? '' }
    })
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY не настроен' }, { status: 500 })
    }

    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])

    const productList = products
      .map((p: any) => `- ${p.title} | ${p.price} сом | slug: ${p.slug}`)
      .join('\n')

    const categoryList = categories
      .map((c: any) => `- ${c.name} | slug: ${c.slug}`)
      .join('\n')

    const systemPrompt = `Ты — дружелюбный и живой ассистент интернет-магазина спортивных товаров SPORTCORE.
Общайся как живой человек — тепло, просто и по делу.

КАК УСТРОЕН САЙТ:
- Вверху страницы есть строка поиска — можно вбить название товара
- В шапке сайта есть кнопка "Корзина"
- Раздел "Каталог" в меню — там все категории товаров
- Раздел "FAQ" в меню — ответы на частые вопросы
- Кнопка "Связаться с нами" ведёт в WhatsApp

КАТЕГОРИИ НА САЙТЕ:
${categoryList || 'Нет данных'}

ТОВАРЫ НА САЙТЕ (название | цена | slug):
${productList || 'Нет данных'}

ВАЖНО — формат ответа:
Ты ВСЕГДА отвечаешь ТОЛЬКО валидным JSON объектом без лишнего текста, строго в таком формате:
{
  "message": "твой ответ пользователю",
  "action": null
}

Если пользователь хочет перейти на конкретный товар или ты рекомендуешь конкретный товар — добавь action:
{
  "message": "твой ответ",
  "action": {
    "type": "navigate",
    "url": "/product/SLUG_ТОВАРА",
    "label": "Название товара"
  }
}

Если пользователь хочет перейти в категорию:
{
  "message": "твой ответ",
  "action": {
    "type": "navigate",
    "url": "/category/SLUG_КАТЕГОРИИ",
    "label": "Название категории"
  }
}

Правила:
1. Отвечай ТОЛЬКО на русском языке
2. Говори как живой консультант — тепло и по-человечески
3. Никогда не пиши технические пути в поле message — только в action.url
4. Если рекомендуешь товар — всегда добавляй action с navigate
5. Если товара нет — предложи поискать через строку поиска вверху сайта
6. Не выдумывай товары которых нет в списке
7. Отвечай кратко — 2-3 предложения в message`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'Ошибка Groq API' }, { status: 500 })
    }

    const data = await response.json()
    const raw = data?.choices?.[0]?.message?.content ?? '{}'

    try {
      const parsed = JSON.parse(raw)
      return NextResponse.json({
        message: parsed.message ?? 'Извините, не смог ответить.',
        action: parsed.action ?? null,
      })
    } catch {
      return NextResponse.json({ message: raw, action: null })
    }
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}