import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://sportcore-crm.vercel.app',
  'http://localhost:3000',
  'file://',
]

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

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const { name, price } = await req.json()

  const prompt = `Ты помогаешь заполнить карточку товара для спортивного магазина SPORTCORE в Бишкеке (Кыргызстан). Цены в сомах.

Товар: "${name}"
Цена: ${price} сом

КАТЕГОРИИ МАГАЗИНА (выбери ОДНУ наиболее подходящую):
- fitnes — фитнес и восстановление: МФР роллы, эспандеры, резинки, утяжелители, гири, гантели, фитболы, скакалки, ролики для пресса, балансировочные подушки
- myachi — мячи и игры: футбольные/баскетбольные/волейбольные мячи, бадминтон, настольный теннис, ракетки
- plavanie — плавание: очки для плавания, шапки для плавания, плавки, антифог
- edinoborstva — единоборства и бокс: боксёрские перчатки, груши, каппы, бинты, надувной мешок, хлопушки
- futbol — футбол: сороконожки, бутсы, вратарские перчатки, щитки, фишки, форма, манишки, футбольные сумки
- aksessuary — аксессуары: бутылки, шейкеры, рюкзаки, тейп, свистки, носки, повязки, насос, чехлы, сетки
- zdorovie — здоровье и массаж: аппликаторы, массажёры, бандажи, наколенники, фиксаторы, стельки, тренажёр для дыхалки

Сгенерируй данные и верни ТОЛЬКО валидный JSON без лишнего текста:
{
  "slug": "transliteratsiya-nazvaniia-cherez-defis-s-klyuchevymi-slovami",
  "category_slug": "один из slug категорий выше",
  "description": "Продающее описание 2-3 предложения на русском. Укажи назначение, преимущества, для кого подойдёт.",
  "seo_title": "Купить [название] в Бишкеке | SPORTCORE — до 60 символов",
  "seo_desc": "Купить [название] в Бишкеке по цене ${price} сом. [ключевое преимущество]. Быстрая доставка по Кыргызстану. SPORTCORE — до 155 символов",
  "featured": false
}

Правила slug: только латиница, цифры и дефисы. Транслитерация русских слов. Примеры: "Кроссовки Nike" → "krossovki-nike", "МФР ролл 33 см" → "mfr-roll-33-sm".`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Groq error' }, { status: 500, headers: corsHeaders(origin) })
  }

  const data = await response.json()
  const raw = data?.choices?.[0]?.message?.content || '{}'
  const jsonMatch = raw.match(/\{[\s\S]*\}/)

  try {
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    return NextResponse.json(result, { headers: corsHeaders(origin) })
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500, headers: corsHeaders(origin) })
  }
}