import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Часто задаваемые вопросы — SPORTCORE Бишкек',
  description:
    'Ответы на популярные вопросы о заказе, оплате, доставке, возврате и гарантии в магазине SPORTCORE. Доставка по Бишкеку и всему Кыргызстану.',
  alternates: { canonical: 'https://sportcore.kg/faq' },
  openGraph: {
    title: 'Часто задаваемые вопросы — SPORTCORE',
    description: 'Ответы на вопросы о заказе, оплате, доставке и возврате.',
    url: 'https://sportcore.kg/faq',
    type: 'website',
  },
}

type FaqItem = { question: string; answer: string }

const faqs: FaqItem[] = [
  {
    question: 'Как оформить заказ?',
    answer:
      'Выберите товар, добавьте его в корзину и перейдите к оформлению. Заполните необходимые поля — после этого заказ автоматически поступит в WhatsApp нашего сотрудника. Он свяжется с вами для подтверждения и оплаты: по карте или наличными (в пределах Бишкека). Для заказов за городом доступна только оплата картой.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer:
      'Банковские карты (Visa/Mastercard/Элкарт), электронные кошельки и наличный расчёт при получении (в городе Бишкек).',
  },
  {
    question: 'Сколько занимает доставка?',
    answer:
      'По Бишкеку — 1 рабочий день. По регионам Кыргызстана — ориентировочно 3–5 рабочих дней.',
  },
  {
    question: 'Можно ли вернуть или обменять товар?',
    answer:
      'В случае производственного брака вы можете оформить возврат или обмен в течение 14 дней с момента получения товара при сохранении товарного вида и упаковки.',
  },
  {
    question: 'Могу ли я изменить заказ после оформления?',
    answer:
      'Если заказ ещё не передан на доставку — да. Напишите нам как можно быстрее через раздел «Связаться с нами».',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://sportcore.kg' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://sportcore.kg/faq' },
  ],
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <nav aria-label="Хлебные крошки" className="text-sm text-gray-500 mb-6 flex gap-1">
          <a href="/" className="hover:text-gray-700">Главная</a>
          <span>/</span>
          <span className="text-gray-800">FAQ</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl text-[#1a1f4b] font-bold text-center mb-2">
          Часто задаваемые вопросы
        </h1>
        <p className="text-center text-[#1a1f4b] mb-8">
          Собрали ответы на самые популярные вопросы о покупках в SPORTCORE.
        </p>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm open:shadow-md transition"
            >
              <summary className="list-none cursor-pointer select-none px-5 py-4 min-h-[56px] flex items-center justify-between gap-3">
                <span className="font-semibold text-base sm:text-lg leading-snug">{item.question}</span>
                <svg
                  className="h-5 w-5 transition-transform group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 1.04 1.08l-4.24 3.36a.75.75 0 0 1-.94 0L5.25 8.31a.75.75 0 0 1-.02-1.1z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-5 -mt-1 text-gray-600">{item.answer}</div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/category"
            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 transition"
          >
            Перейти в каталог
          </a>
        </div>
      </section>
    </>
  )
}
