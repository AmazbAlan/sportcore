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
        className="object-cover scale-110"
      />

      {/* Градиент */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f122e]/95 via-[#0f122e]/70 to-transparent" />

      {/* Контент */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >

          {/* Заголовок */}
          <h1 className="
            text-4xl 
            sm:text-6xl 
            md:text-7xl 
            font-extrabold 
            leading-[1.05] 
            tracking-tight 
            text-white
          ">
            <span className="block mb-3">
              Всё для спорта
            </span>

            <span className="
              block 
              text-yellow-400 
              drop-shadow-[0_4px_20px_rgba(255,200,0,0.35)]
            ">
              в SPORTCORE
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="
            mt-7 
            text-base 
            sm:text-lg 
            text-white/80 
            max-w-md 
            leading-relaxed
          ">
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
                text-base
                hover:bg-yellow-300 
                transition 
                hover:scale-105
                shadow-xl
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

      {/* Плавный низ */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />

    </section>
  )
}