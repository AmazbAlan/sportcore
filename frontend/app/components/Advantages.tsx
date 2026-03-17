'use client'

import { motion } from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  MessageCircle
} from 'lucide-react'

export default function Advantages() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      {/* Заголовок */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Надежность, скорость и удобство
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">

        {/* 🔥 ГЛАВНАЯ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="
            col-span-2 md:col-span-2
            rounded-2xl p-6
            bg-gradient-to-br from-[#1a1f4b] to-[#2a2f6b]
            text-white
            relative overflow-hidden
            shadow-lg
            hover:shadow-2xl
            transition
          "
        >
          <Truck className="w-7 h-7 mb-4 text-yellow-400" />

          <h3 className="text-lg font-semibold mb-1">
            Быстрая доставка
          </h3>

          <p className="text-white/80 text-sm">
            По Бишкеку — в течение 1 дня
          </p>

          {/* glow */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />
        </motion.div>

        {/* Остальные */}
        {[
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
        ].map((item, i) => {
          const Icon = item.icon

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="
                group
                p-5
                rounded-2xl
                bg-white
                border border-gray-100
                shadow-sm

                hover:shadow-lg
                hover:-translate-y-1
                transition-all
              "
            >
              <Icon className="
                w-6 h-6 mb-3
                text-[#1a1f4b]
                group-hover:scale-110
                transition
              " />

              <h4 className="text-sm font-semibold text-[#1a1f4b]">
                {item.title}
              </h4>

              <p className="text-xs text-gray-500 mt-1">
                {item.desc}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}