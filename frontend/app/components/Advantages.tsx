export default function Advantages() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      {/* Заголовок */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2">
          Мы делаем покупки удобными и надежными
        </p>
      </div>

      {/* Сетка */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ГЛАВНАЯ карточка */}
        <div className="
          relative 
          rounded-3xl 
          p-8 
          bg-[#1a1f4b] 
          text-white
          shadow-xl
        ">

          <div className="text-3xl mb-4">🚚</div>

          <h3 className="text-xl font-semibold mb-2">
            Быстрая доставка
          </h3>

          <p className="text-white/80 max-w-sm">
            По Бишкеку — в течение 1 дня. Быстро, удобно и без лишних ожиданий
          </p>

          {/* декоративный glow */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />

        </div>

        {/* Правая часть */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* карточка */}
          <div className="
            p-6 
            rounded-2xl 
            bg-white 
            shadow-sm 
            border border-gray-100
            hover:shadow-lg 
            transition
          ">
            <div className="text-xl mb-3">✔</div>
            <h4 className="font-semibold text-[#1a1f4b] mb-1">
              Проверенное качество
            </h4>
            <p className="text-sm text-gray-500">
              Каждый товар проверяется перед отправкой
            </p>
          </div>

          <div className="
            p-6 
            rounded-2xl 
            bg-white 
            shadow-sm 
            border border-gray-100
            hover:shadow-lg 
            transition
          ">
            <div className="text-xl mb-3">🔄</div>
            <h4 className="font-semibold text-[#1a1f4b] mb-1">
              Возврат 14 дней
            </h4>
            <p className="text-sm text-gray-500">
              Если есть брак — обмен или возврат
            </p>
          </div>

          <div className="
            p-6 
            rounded-2xl 
            bg-white 
            shadow-sm 
            border border-gray-100
            hover:shadow-lg 
            transition
          ">
            <div className="text-xl mb-3">💬</div>
            <h4 className="font-semibold text-[#1a1f4b] mb-1">
              Помощь в выборе
            </h4>
            <p className="text-sm text-gray-500">
              Подберем лучший вариант под ваши задачи
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}