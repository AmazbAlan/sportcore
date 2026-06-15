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
        alt="SPORTCORE — спортивный магазин в Бишкеке, Кыргызстан. Одежда, обувь, инвентарь для спорта и фитнеса"
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
            text-[2rem]
            sm:text-5xl
            md:text-7xl
            font-extrabold
            leading-[1.08]
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
          <p className="mt-6 text-base sm:text-lg text-white/75 max-w-sm leading-relaxed">
            Одежда, обувь и инвентарь для спорта и фитнеса. Доставка по всему Кыргызстану.
          </p>

          {/* Кнопки */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <Link
              href="/category"
              className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a1f4b] px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl"
            >
              Перейти в каталог
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=+996774231202&text=Здравствуйте%2C%20я%20пишу%20с%20сайта"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-white/20 transition-all"
            >
              Связаться с нами
            </a>
          </div>

        </motion.div>

      </div>

      {/* Плавный низ */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />

    </section>
  )
}