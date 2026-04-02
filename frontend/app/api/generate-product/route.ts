import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
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

Правила slug:
- Только латиница, цифры и дефисы
- Транслитерация русских слов: к→k, р→r, о→o, с→s, и→i, т→t, н→n, е→e и т.д.
- Добавь ключевые слова для SEO
- Примеры: "Кроссовки Nike Air Max" → "krossovki-nike-air-max", "МФР ролл 33 см" → "mfr-roll-33-sm", "Эспандер бублик" → "ekspander-bublik"
- Slug должен быть уникальным — добавь характеристику если название общее`

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
    const err = await response.text()
    console.error('Groq error:', err)
    return NextResponse.json({ error: 'Groq error' }, { status: 500 })
  }

  const data = await response.json()
  const raw = data?.choices?.[0]?.message?.content || '{}'
  const jsonMatch = raw.match(/\{[\s\S]*\}/)

  try {
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }
}