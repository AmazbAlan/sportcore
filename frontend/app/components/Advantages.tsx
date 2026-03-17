export default function Advantages() {
  const items = [
    {
      icon: '✔',
      title: 'Проверенное качество',
      desc: 'Каждый товар проходит проверку перед отправкой',
    },
    {
      icon: '🚚',
      title: 'Быстрая доставка',
      desc: 'По Бишкеку — в течение 1 дня',
    },
    {
      icon: '🔄',
      title: 'Возврат 14 дней',
      desc: 'Если товар с браком — заменим или вернем деньги',
    },
    {
      icon: '💬',
      title: 'Помощь в выборе',
      desc: 'Подскажем лучший вариант под вашу задачу',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      
      {/* Заголовок */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Мы делаем покупки удобными, быстрыми и надежными
        </p>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              relative
              bg-white/80
              backdrop-blur-md
              rounded-2xl
              p-5 md:p-6
              border border-gray-100
              shadow-sm
              transition-all
              duration-300
              hover:shadow-2xl
              hover:-translate-y-1
              group
            "
          >
            {/* Градиент hover */}
            <div className="
              absolute inset-0 
              rounded-2xl 
              bg-gradient-to-br from-[#1a1f4b]/5 to-transparent 
              opacity-0 
              group-hover:opacity-100 
              transition
            " />

            {/* Иконка */}
            <div className="
              relative z-10
              w-10 h-10 md:w-12 md:h-12
              flex items-center justify-center
              rounded-xl
              bg-[#1a1f4b]/10
              text-[#1a1f4b]
              text-lg md:text-xl
              mb-4
              group-hover:scale-110
              transition
            ">
              {item.icon}
            </div>

            {/* Текст */}
            <h3 className="relative z-10 font-semibold text-[#1a1f4b] text-sm md:text-base mb-1">
              {item.title}
            </h3>

            <p className="relative z-10 text-xs md:text-sm text-gray-500 leading-snug">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}