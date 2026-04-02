import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
}

async function fetchProducts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=name,price,slug,category_slug`,
      { headers: sbHeaders, next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=name,slug&order=name.asc`,
      { headers: sbHeaders, next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    return await res.json()
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
      .map((p: any) => `- ${p.name} | ${p.price} сом | slug: ${p.slug}`)
      .join('\n')

    const categoryList = categories
      .map((c: any) => `- ${c.name} | slug: ${c.slug}`)
      .join('\n')

    const systemPrompt = `Ты - дружелюбный ассистент интернет-магазина спортивных товаров SPORTCORE.
Общайся как живой человек - тепло, просто и по делу.

КАК УСТРОЕН САЙТ:
- Главная страница - хиты товаров и баннеры
- Каталог - все категории, кнопка "Каталог" в меню
- Корзина - кнопка "Корзина" в шапке
- FAQ - ответы на частые вопросы
- Поиск - строка поиска вверху
- WhatsApp: +996 774 23 12 02
- Instagram: sportcore.kg

НАВИГАЦИЯ ЧЕРЕЗ ACTION:
Если пользователь хочет перейти — используй navigate action:
- Главная → url: "/"
- Каталог → url: "/category"
- Корзина → url: "/cart"
- FAQ → url: "/faq"
- Поиск → url: "/search?query=ЗАПРОС"
- Товар → url: "/product/SLUG"
- Категория → url: "/category/SLUG"
- WhatsApp → url: "https://api.whatsapp.com/send?phone=+996774231202&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
- Instagram → url: "https://www.instagram.com/sportcore.kg"

КАТЕГОРИИ:
${categoryList || 'Нет данных'}

ТОВАРЫ (название | цена | slug):
${productList || 'Нет данных'}

АДРЕС: г. Бишкек, проспект Чынгыза Айтматова 299в, ТРЦ Ала-Арча 2 этаж

ВАЖНО — формат ответа. Отвечай ТОЛЬКО валидным JSON:
{
  "message": "твой ответ пользователю",
  "action": null
}

Если рекомендуешь товар или категорию — добавь action:
{
  "message": "твой ответ",
  "action": {
    "type": "navigate",
    "url": "/product/SLUG",
    "label": "Название"
  }
}

Правила:
1. Отвечай на русском (можно кыргызский, английский)
2. Говори как живой консультант
3. Никогда не пиши технические пути в message — только в action.url
4. Если рекомендуешь товар — добавляй action
5. Отвечай кратко — 2-3 предложения`

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
      return NextResponse.json({ error: 'Ошибка Groq API' }, { status: 500 })
    }

    const data = await response.json()
    const raw = data?.choices?.[0]?.message?.content ?? '{}'

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      return NextResponse.json({
        message: parsed?.message ?? raw,
        action: parsed?.action ?? null,
      })
    } catch {
      return NextResponse.json({ message: raw, action: null })
    }
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
