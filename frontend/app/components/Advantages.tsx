'use client'

import { motion } from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  MessageCircle
} from 'lucide-react'

const leftItems = [
  {
    icon: Truck,
    title: 'Быстрая доставка',
    desc: 'Доставим по Бишкеку уже сегодня'
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия качества',
    desc: 'Все товары проверены перед отправкой'
  },
]

const rightItems = [
  {
    icon: RefreshCcw,
    title: 'Возврат за 14 дней',
    desc: 'Обменяем или вернём деньги без вопросов'
  },
  {
    icon: MessageCircle,
    title: 'Помогаем с выбором',
    desc: 'Подберём лучший вариант под ваши задачи'
  }
]

export default function Advantages() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">

      {/* Заголовок */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Надежность, скорость и удобство
        </p>
      </div>

      {/* Макет: левые | фото | правые */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">

        {/* Левые — с разделителем */}
        <div className="flex flex-col">
          {leftItems.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-end text-right px-4 py-8 hover:-translate-y-1 transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-[#f0f2ff] flex items-center justify-center mb-4 group-hover:bg-[#1a1f4b] transition-colors">
                    <Icon className="w-10 h-10 text-[#1a1f4b] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1a1f4b]">{item.title}</h4>
                  <p className="text-lg text-gray-500 mt-2 max-w-[280px] leading-relaxed">{item.desc}</p>
                </motion.div>

                {/* Разделитель только между двумя элементами */}
                {i === 0 && (
                  <div className="w-full h-[2px] bg-[#1a1f4b] opacity-20 rounded-full mx-auto" />
                )}
              </div>
            )
          })}
        </div>

        {/* Центр — фото */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-56 h-56 md:w-72 md:h-72 mx-auto"
        >
          <img src="/advantages.webp" alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Правые — с разделителем */}
        <div className="flex flex-col">
          {rightItems.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-start text-left px-4 py-8 hover:-translate-y-1 transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-[#f0f2ff] flex items-center justify-center mb-4 group-hover:bg-[#1a1f4b] transition-colors">
                    <Icon className="w-10 h-10 text-[#1a1f4b] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1a1f4b]">{item.title}</h4>
                  <p className="text-lg text-gray-500 mt-2 max-w-[280px] leading-relaxed">{item.desc}</p>
                </motion.div>

                {/* Разделитель только между двумя элементами */}
                {i === 0 && (
                  <div className="w-full h-[2px] bg-[#1a1f4b] opacity-20 rounded-full mx-auto" />
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
