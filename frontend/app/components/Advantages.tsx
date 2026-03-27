'use client'

import { motion } from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  MessageCircle
} from 'lucide-react'

const items = [
  {
    icon: Truck,
    title: 'Быстрая доставка',
    desc: 'По Бишкеку — в течение 1 дня'
  },
  {
    icon: ShieldCheck,
    title: 'Проверенное качество',
    desc: 'Каждый товар проходит проверку'
  },
  {
    icon: RefreshCcw,
    title: 'Возврат 14 дней',
    desc: 'Если есть брак — обмен или возврат'
  },
  {
    icon: MessageCircle,
    title: 'Помощь в выборе',
    desc: 'Подскажем лучший вариант'
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

      {/* Макет: 2 карточки | фото | 2 карточки */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">

        {/* Левые карточки */}
        <div className="flex flex-col gap-6">
          {items.slice(0, 2).map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-end text-right p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-[#f0f2ff] flex items-center justify-center mb-3 group-hover:bg-[#1a1f4b] transition-colors">
                  <Icon className="w-5 h-5 text-[#1a1f4b] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-semibold text-[#1a1f4b]">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-[220px]">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Центр — место для фото */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-48 h-48 md:w-64 md:h-64 "
        >
          {/* Сюда поставь своё фото */}
          <img src="/advantages.webp" alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Правые карточки */}
        <div className="flex flex-col gap-6">
          {items.slice(2, 4).map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-start text-left p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-[#f0f2ff] flex items-center justify-center mb-3 group-hover:bg-[#1a1f4b] transition-colors">
                  <Icon className="w-5 h-5 text-[#1a1f4b] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-semibold text-[#1a1f4b]">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-[220px]">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}