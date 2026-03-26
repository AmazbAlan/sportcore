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
      .map((p: any) => `- ${p.title} | ${p.price} сом | /product/${p.slug}`)
      .join('\n')

    const categoryList = categories
      .map((c: any) => `- ${c.name} | /category/${c.slug}`)
      .join('\n')

    const systemPrompt = `Ты — дружелюбный и живой ассистент интернет-магазина спортивных товаров SPORTCORE.
Общайся как живой человек — тепло, просто и по делу. Никаких технических ссылок типа /search или /cart в ответах.

КАК УСТРОЕН САЙТ (объясняй это своими словами, не давай ссылки):
- Вверху страницы есть строка поиска — можно вбить название товара и найти всё что есть
- В шапке сайта есть кнопка "Корзина" — там хранятся выбранные товары
- Раздел "Каталог" в меню — там все категории товаров
- Раздел "FAQ" в меню — ответы на частые вопросы
- Кнопка "Связаться с нами" ведёт в WhatsApp

КАТЕГОРИИ НА САЙТЕ:
${categoryList || 'Нет данных'}

ТОВАРЫ НА САЙТЕ (название | цена в сомах):
${productList || 'Нет данных'}

Правила:
1. Отвечай ТОЛЬКО на русском языке
2. Говори как живой консультант в магазине — тепло и по-человечески
3. Никогда не пиши технические пути типа /search, /cart, /category — вместо этого описывай словами где это находится
4. Если спрашивают про товар по бюджету — назови конкретные товары из списка с ценами
5. Если товара нет — предложи поискать через строку поиска вверху сайта
6. Не выдумывай товары которых нет в списке выше
7. Отвечай кратко — 2-4 предложения максимум`

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
    const text = data?.choices?.[0]?.message?.content ?? 'Извините, не смог ответить.'

    return NextResponse.json({ message: text })
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}