import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
}

// Только товары В НАЛИЧИИ (qty > 0), с описанием для умных ответов
async function fetchProducts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=name,price,slug,category_slug,description,seo_desc&qty=gt.0&order=name.asc`,
      { headers: sbHeaders, next: { revalidate: 120 } } // 2 минуты — актуальный сток
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

// Извлекаем текст из description (jsonb или строка)
function extractDesc(raw: any): string {
  if (!raw) return ''
  if (typeof raw === 'string') return raw.slice(0, 120)
  if (Array.isArray(raw)) {
    const text = raw
      .map((b: any) => (b?.children || []).map((c: any) => c?.text || '').join(' '))
      .join(' ')
      .trim()
    return text.slice(0, 120)
  }
  return ''
}

// Обрезаем историю: оставляем системный промпт + последние N сообщений
// Это предотвращает превышение контекста Groq
const MAX_HISTORY = 8 // последние 8 сообщений (4 пары вопрос-ответ)

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY не настроен' }, { status: 500 })
    }

    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])

    // Список категорий
    const categoryList = categories
      .map((c: any) => `- ${c.name} (slug: ${c.slug})`)
      .join('\n')

    // Список товаров в наличии — с кратким описанием
    // Ограничиваем до 150 товаров чтобы не перегружать контекст
    const productList = products
      .slice(0, 150)
      .map((p: any) => {
        const desc = extractDesc(p.description) || extractDesc(p.seo_desc)
        const descPart = desc ? ` | ${desc}` : ''
        return `- ${p.name} | ${p.price} сом | slug: ${p.slug}${descPart}`
      })
      .join('\n')

    const systemPrompt = `Ты — живой консультант интернет-магазина спортивных товаров SPORTCORE в Бишкеке.

ВАЖНО: рекомендуй ТОЛЬКО товары из списка ниже. Это реальные товары которые ЕСТЬ В НАЛИЧИИ прямо сейчас. Если товара нет в списке — честно скажи что такого нет, и предложи что-то похожее из списка.

КАТЕГОРИИ:
${categoryList || 'Нет данных'}

ТОВАРЫ В НАЛИЧИИ (название | цена | slug | описание):
${productList || 'Товаров нет'}

КОНТАКТЫ И НАВИГАЦИЯ:
- WhatsApp: +996 774 23 12 02
- Instagram: sportcore.kg
- Адрес: Бишкек, пр. Ч. Айтматова 299в, ТРЦ Ала-Арча, 2 этаж
- Главная: /
- Каталог: /category
- Корзина: /cart
- FAQ: /faq
- Поиск: /search?query=ЗАПРОС

Отвечай ТОЛЬКО валидным JSON (без markdown, без \`\`\`):
Если не нужна навигация:
{"message": "твой ответ", "action": null}

Если рекомендуешь конкретный товар — добавляй action:
{"message": "твой ответ", "action": {"type": "navigate", "url": "/product/SLUG", "label": "Название товара"}}

Если рекомендуешь категорию:
{"message": "твой ответ", "action": {"type": "navigate", "url": "/category/SLUG", "label": "Название категории"}}

Правила:
1. Отвечай на русском, тепло и по делу, 2-3 предложения максимум
2. Рекомендуй ТОЛЬКО товары из списка выше
3. Если несколько подходящих товаров — упомяни 2-3 в тексте, в action дай ссылку на самый подходящий
4. Если товара нет — честно скажи и предложи похожее из наличия
5. Никогда не пиши пути (/product/...) в message — только в action.url`

    // Обрезаем историю чтобы не превысить контекст
    const trimmedHistory = messages.slice(-MAX_HISTORY)

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
          ...trimmedHistory.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.4, // чуть ниже = точнее, меньше галлюцинаций
        max_tokens: 400,  // ответ ассистента короткий — не нужно больше
      }),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error('Groq chat error:', response.status, errText)
      return NextResponse.json(
        { message: 'Извини, сейчас технические неполадки. Напиши нам в WhatsApp: +996 774 23 12 02', action: {
          type: 'navigate',
          url: 'https://api.whatsapp.com/send?phone=996774231202&text=Здравствуйте',
          label: 'Написать в WhatsApp'
        }},
        { status: 200 } // возвращаем 200 чтобы чат показал красивое сообщение, не «Ошибка ответа»
      )
    }

    const data = await response.json()
    const raw: string = data?.choices?.[0]?.message?.content ?? '{}'

    // Убираем возможные ``` обёртки
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/,'').trim()

    try {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      return NextResponse.json({
        message: parsed?.message ?? cleaned,
        action: parsed?.action ?? null,
      })
    } catch {
      // JSON не распарсился — отдаём raw текст как обычный ответ
      return NextResponse.json({ message: cleaned || raw, action: null })
    }
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json(
      { message: 'Извини, что-то пошло не так. Попробуй ещё раз или напиши в WhatsApp: +996 774 23 12 02', action: null },
      { status: 200 }
    )
  }
}