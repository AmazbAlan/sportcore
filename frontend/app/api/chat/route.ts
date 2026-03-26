// frontend/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
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

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY не настроен' }, { status: 500 })
    }

    // Загружаем актуальные товары и категории
    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])

    const productList = products
      .map((p: any) => `- ${p.title} | ${p.price} сом | /product/${p.slug}`)
      .join('\n')

    const categoryList = categories
      .map((c: any) => `- ${c.name} | /category/${c.slug}`)
      .join('\n')

    const systemPrompt = `Ты — дружелюбный ИИ-ассистент интернет-магазина спортивных товаров SPORTCORE (sportcore.kg).
Ты помогаешь покупателям найти нужные товары, объясняешь как перемещаться по сайту, советуешь товары по бюджету.

Сайт имеет следующие страницы:
- Главная: /
- Каталог всех категорий: /category
- Поиск: /search?query=...
- Корзина: /cart
- FAQ: /faq

КАТЕГОРИИ НА САЙТЕ:
${categoryList || 'Загрузка...'}

ТОВАРЫ НА САЙТЕ (название | цена | ссылка):
${productList || 'Загрузка...'}

Правила:
1. Отвечай ТОЛЬКО на русском языке
2. Если пользователь ищет товар по бюджету — предложи подходящие из списка выше
3. Если спрашивают о навигации — объясни как перейти на нужную страницу
4. Будь кратким и полезным, не более 3-4 предложений
5. Если товара нет в списке — скажи что можно поискать через поиск на сайте
6. Не выдумывай товары которых нет в списке`

    // Конвертируем историю сообщений в формат Gemini
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini error:', err)
      return NextResponse.json({ error: 'Ошибка Gemini API' }, { status: 500 })
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Извините, не смог ответить.'

    return NextResponse.json({ message: text })
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
