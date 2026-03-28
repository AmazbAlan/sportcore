'use client'

import { motion } from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  MessageCircle
} from 'lucide-react'

const allItems = [
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
  {
    icon: RefreshCcw,
    title: 'Возврат за 14 дней',
    desc: 'Обменяем товар или вернём деньги в случае проблем'
  },
  {
    icon: MessageCircle,
    title: 'Клиентоориентированность',
    desc: 'Подберём лучший вариант под ваши задачи'
  }
]

const leftItems = allItems.slice(0, 2)
const rightItems = allItems.slice(2, 4)

export default function Advantages() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">

      {/* Заголовок */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Надежность, скорость и удобство
        </p>
      </div>

      {/* МОБИЛЬНАЯ версия — 2 колонки простые карточки */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {allItems.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#f0f2ff] flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-[#1a1f4b]" />
              </div>
              <h4 className="text-sm font-bold text-[#1a1f4b] leading-tight">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* ДЕСКТОП версия — оригинальный макет */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-6 items-center">

        {/* Левые */}
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
                  className="group flex flex-row items-center justify-end gap-5 text-right px-4 py-8 hover:-translate-y-1 transition-all"
                >
                  <div>
                    <h4 className="text-2xl font-bold text-[#1a1f4b]">{item.title}</h4>
                    <p className="text-lg text-gray-500 mt-2 max-w-[280px] leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="shrink-0 w-20 h-20 rounded-full bg-[#f0f2ff] flex items-center justify-center group-hover:bg-[#1a1f4b] transition-colors">
                    <Icon className="w-10 h-10 text-[#1a1f4b] group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
                {i === 0 && <div className="w-full h-[2px] bg-[#1a1f4b] opacity-20 rounded-full" />}
              </div>
            )
          })}
        </div>

        {/* Центр - фото */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-72 h-72 mx-auto"
        >
          <img src="/advantages.webp" alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Правые */}
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
                  className="group flex flex-row items-center justify-start gap-5 text-left px-4 py-8 hover:-translate-y-1 transition-all"
                >
                  <div className="shrink-0 w-20 h-20 rounded-full bg-[#f0f2ff] flex items-center justify-center group-hover:bg-[#1a1f4b] transition-colors">
                    <Icon className="w-10 h-10 text-[#1a1f4b] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#1a1f4b]">{item.title}</h4>
                    <p className="text-lg text-gray-500 mt-2 max-w-[280px] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
                {i === 0 && <div className="w-full h-[2px] bg-[#1a1f4b] opacity-20 rounded-full" />}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}