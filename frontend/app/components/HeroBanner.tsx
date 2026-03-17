'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <section className="w-full">

      {/* ================= MOBILE ================= */}
      <div className="md:hidden">

        {/* Картинка */}
        <div className="relative w-full h-[300px]">
          <Image
            src="/banner2.png"
            alt="Sportcore"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Контент */}
        <div className="px-4 py-6 text-center bg-white">

          <h1 className="text-2xl font-bold text-[#1a1f4b] leading-tight">
            Всё для спорта  
            <br />
            <span className="text-yellow-500">
              в SPORTCORE
            </span>
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Качественные товары для тренировок и активной жизни
          </p>

          <Link
            href="/category"
            className="
              mt-5 block
              bg-yellow-400 
              text-[#1a1f4b] 
              py-3 
              rounded-xl 
              font-semibold
              active:scale-95
            "
          >
            Перейти в каталог
          </Link>

        </div>

      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex relative w-full min-h-[85vh] items-center overflow-hidden">

        {/* Фон */}
        <Image
          src="/banner2.png"
          alt="Sportcore"
          fill
          priority
          className="object-cover object-[70%_center] scale-110"
        />

        {/* Градиенты */}
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

            <h1 className="text-6xl font-extrabold leading-[1.05] text-white">
              <span className="block mb-3">
                Всё для спорта
              </span>
              <span className="text-yellow-400">
                в SPORTCORE
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/80 max-w-md">
              Качественные товары для тренировок и активного образа жизни
            </p>

            <div className="mt-10">
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
                "
              >
                Перейти в каталог
              </Link>
            </div>

          </motion.div>

        </div>

      </div>

    </section>
  )
}