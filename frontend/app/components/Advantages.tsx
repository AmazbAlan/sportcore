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
    <section className="max-w-7xl mx-auto px-4 py-20">

      {/* Заголовок */}
      <div className="text-center mb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4b]">
          Почему выбирают SPORTCORE
        </h2>
        <p className="text-gray-500 mt-2">
          Надежность, скорость и удобство в каждой покупке
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ГЛАВНАЯ карточка */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            relative 
            rounded-3xl 
            p-8 
            bg-[#1a1f4b] 
            text-white
            shadow-xl
            overflow-hidden
          "
        >
          <Truck className="w-8 h-8 mb-5 text-yellow-400" />

          <h3 className="text-xl font-semibold mb-2">
            Быстрая доставка
          </h3>

          <p className="text-white/80 max-w-sm">
            По Бишкеку — в течение 1 дня. Быстро и без лишних ожиданий
          </p>

          {/* Glow */}
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl" />
        </motion.div>

        {/* Остальные */}
        <div className="grid sm:grid-cols-2 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="
              p-6 
              rounded-2xl 
              bg-white 
              border border-gray-100
              shadow-sm 
              hover:shadow-xl 
              transition
              group
            "
          >
            <ShieldCheck className="w-6 h-6 mb-3 text-[#1a1f4b] group-hover:scale-110 transition" />

            <h4 className="font-semibold text-[#1a1f4b] mb-1">
              Проверенное качество
            </h4>

            <p className="text-sm text-gray-500">
              Каждый товар проходит проверку перед отправкой
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="
              p-6 
              rounded-2xl 
              bg-white 
              border border-gray-100
              shadow-sm 
              hover:shadow-xl 
              transition
              group
            "
          >
            <RefreshCcw className="w-6 h-6 mb-3 text-[#1a1f4b] group-hover:rotate-180 transition duration-500" />

            <h4 className="font-semibold text-[#1a1f4b] mb-1">
              Возврат 14 дней
            </h4>

            <p className="text-sm text-gray-500">
              Если товар с браком — обмен или возврат
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="
              p-6 
              rounded-2xl 
              bg-white 
              border border-gray-100
              shadow-sm 
              hover:shadow-xl 
              transition
              group
            "
          >
            <MessageCircle className="w-6 h-6 mb-3 text-[#1a1f4b] group-hover:scale-110 transition" />

            <h4 className="font-semibold text-[#1a1f4b] mb-1">
              Помощь в выборе
            </h4>

            <p className="text-sm text-gray-500">
              Подскажем лучший вариант под вашу задачу
            </p>
          </motion.div>

        </div>

      </div>

    </section>
  )
}