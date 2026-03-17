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
        className="
          object-cover 
          object-center 
          md:object-[70%_center]
          scale-110
        "
      />

      {/* Градиенты */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0f122e]/95 via-[#0f122e]/70 to-transparent" />

      {/* Контент */}
      <div className="
        relative z-10 
        max-w-7xl mx-auto 
        w-full 
        px-4 md:px-6
      ">

        <motion.div
          initial={{ opacity: 0, y: 40, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.6 }}
          className="
            max-w-xl 
            text-center 
            md:text-left
            mx-auto md:mx-0
          "
        >

          {/* Заголовок */}
          <h1 className="
            text-3xl 
            sm:text-4xl 
            md:text-6xl 
            lg:text-7xl 
            font-extrabold 
            leading-[1.1] 
            tracking-tight 
            text-white
          ">
            <span className="block mb-2 md:mb-3">
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
            mt-4 md:mt-6
            text-sm 
            sm:text-base 
            md:text-lg 
            text-white/80 
            max-w-md 
            mx-auto md:mx-0
            leading-relaxed
          ">
            Качественные товары для тренировок и активного образа жизни
          </p>

          {/* Кнопка */}
          <div className="
            mt-6 md:mt-10 
            flex 
            justify-center md:justify-start
          ">

            <Link
              href="/category"
              className="
                w-full sm:w-auto
                bg-yellow-400 
                text-[#1a1f4b] 
                px-6 sm:px-8 
                py-3 sm:py-4
                rounded-xl 
                font-semibold 
                text-sm sm:text-base
                hover:bg-yellow-300 
                transition 
                active:scale-95
                shadow-lg
              "
            >
              Перейти в каталог
            </Link>

          </div>

        </motion.div>

      </div>

      {/* Плавный низ */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 bg-gradient-to-t from-white to-transparent" />

    </section>
  )
}