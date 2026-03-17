'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">

      {/* Фон */}
      <Image
        src="/banner2.png"
        alt="Sportcore"
        fill
        priority
        className="object-cover scale-105"
      />

      {/* Мягкое затемнение */}
      <div className="absolute inset-0 bg-[#0f122e]/70" />

      {/* Контент */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">

        {/* Лёгкая анимация появления */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Тег */}
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm text-white/80 border border-white/10">
            Бишкек • Доставка за 1 день
          </div>

          {/* Заголовок */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
            Всё для спорта  
            <br />
            <span className="text-yellow-400">
              и активной жизни
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Фитнес, бокс, йога, мячи и многое другое — всё в одном месте
          </p>

          {/* Кнопки */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

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
                shadow-lg
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