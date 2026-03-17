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
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Надежность, скорость и удобство
        </p>
      </div>

      {/* Сетка */}
      <div className="
        grid gap-4
        grid-cols-2
        md:grid-cols-4
      ">
        {items.map((item, i) => {
          const Icon = item.icon

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="
                group
                p-4 md:p-6
                rounded-2xl
                bg-white
                border border-gray-100
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                active:scale-[0.97]
                transition-all
              "
            >
              <Icon className="
                w-6 h-6 mb-3
                text-[#1a1f4b]
                group-hover:scale-110
                transition
              " />

              <h4 className="text-sm md:text-base font-semibold text-[#1a1f4b]">
                {item.title}
              </h4>

              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {item.desc}
              </p>
            </motion.div>
          )
        })}
      </div>

    </section>
  )
}