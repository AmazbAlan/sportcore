'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">

      {/* Фон */}
      <Image
        src="/banner2.png"
        alt="Sportcore"
        fill
        priority
        className="object-cover scale-105"
      />

      {/* Затемнение + градиент слева (важно!) */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f122e]/90 via-[#0f122e]/60 to-transparent" />

      {/* Контент */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >

          {/* Заголовок */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-white">
            Всё для спорта  
            <br />
            <span className="text-yellow-400">
              в SPORTCORE
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="mt-6 text-base sm:text-lg text-white/80">
            Качественные товары для тренировок и активного образа жизни
          </p>

          {/* Кнопки */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <Link
              href="/category"
              className="
                bg-yellow-400 
                text-[#1a1f4b] 
                px-8 py-4 
                rounded-xl 
                font-semibold 
                hover:bg-yellow-300 
                transition 
                hover:scale-105
                shadow-xl
                text-center
              "
            >
              Перейти в каталог
            </Link>

            <Link
              href="/category"
              className="
                border border-white/20 
                text-white 
                px-8 py-4 
                rounded-xl 
                font-semibold
                backdrop-blur
                hover:bg-white/10 
                transition
                text-center
              "
            >
              Хиты продаж
            </Link>

          </div>

        </motion.div>

      </div>

      {/* Плавный переход вниз */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />

    </section>
  )
}