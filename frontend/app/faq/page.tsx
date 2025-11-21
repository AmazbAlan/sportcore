// app/faq/page.tsx
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Часто задаваемые вопросы | SPORTCORE | Спорткор | Спорт кор",
  description:
    "Ответы на популярные вопросы о заказе, оплате, доставке, возврате и гарантии в магазине SPORTCORE.",
  openGraph: {
    title: "Часто задаваемые вопросы | SPORTCORE | Спорткор | Спорт кор",
    description:
      "Ответы на популярные вопросы о заказе, оплате, доставке, возврате и гарантии в магазине SPORTCORE.",
    type: "website",
  },
};

type FaqItem = { question: string; answer: string };

const faqs: FaqItem[] = [
  {
    question: "Как оформить заказ?",
    answer:
      "Выберите товар, добавьте его в корзину и перейдите к оформлению. Заполните необходимые поля — после этого заказ автоматически поступит в WhatsApp нашего сотрудника. Он свяжется с вами для подтверждения и оплаты: по карте или наличными (в пределах Бишкека). Для заказов за городом доступна только оплата картой.",
  },
  {
    question: "Какие способы оплаты доступны?",
    answer:
      "Банковские карты (Visa/Mastercard/Элкарт), электронные кошельки и наличный расчёт при получении (в городе Бишкек).",
  },
  {
    question: "Сколько занимает доставка?",
    answer:
      "По Бишкеку 1–2 рабочих дня (можно уточнить желательное время при оформлении заказа). По регионам Кыргызстана — ориентировочно 3–5 рабочих дней (зависит от службы доставки).",
  },
  {
    question: "Можно ли вернуть или обменять товар?",
    answer:
      "Мы тщательно проверяем каждый товар перед отправкой, чтобы быть уверенными в его качестве. Поэтому возврат и обмен, к сожалению, не предусмотрены. Но если у вас возникнут вопросы или трудности с заказом — наша команда всегда готова помочь и найти лучшее решение.",
  },
  {
    question: "Могу ли я изменить заказ после оформления?",
    answer:
      "Если заказ ещё не передан на доставку — да. Напишите нам как можно быстрее через раздел «Связаться с нами».",
  },
  
];

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
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
              <summary className="list-none cursor-pointer select-none px-5 py-4 flex items-center justify-between">
                <span className="font-medium text-lg">{item.question}</span>
                {/* иконка-стрелка */}
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

        {/* CTA-кнопки */}
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
  );
}
