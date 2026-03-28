'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  {
    id: 1,
    label: 'Наша миссия',
    title: 'МЫ ДЕЛАЕМ СПОРТ ДОСТУПНЫМ ДЛЯ КАЖДОГО',
    text: 'Мы верим, что здоровый образ жизни - это не привилегия, а право каждого. Наша миссия - развивать культуру спорта в Кыргызстане и делать качественный спортивный инвентарь доступным для всех, кто стремится к лучшей версии себя.',
  },
  {
    id: 2,
    label: 'Наши ценности',
    title: 'ЗДОРОВЬЕ, ЧЕСТНОСТЬ И ЗАБОТА О ЛЮДЯХ',
    text: 'Мы ценим каждого клиента и верим, что забота о здоровье начинается с правильного выбора. Мы честны в том, что предлагаем - только проверенные товары, которые действительно работают и помогают людям двигаться вперёд.',
  },
  {
    id: 3,
    label: 'Наши цели',
    title: 'СТРОИМ СИЛЬНОЕ И ЗДОРОВОЕ ОБЩЕСТВО',
    text: 'Мы стремимся стать главным спортивным партнёром для жителей Кыргызстана. Наша цель - создать экосистему, где каждый человек найдёт всё необходимое для активной жизни: от первой тренировки до профессиональных достижений.',
  },
]

export default function AboutUs() {
  const [active, setActive] = useState(0)

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      {/* Заголовок */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4b] tracking-widest">
          О НАС
        </h2>
      </div>

      {/* Основной блок */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Фото слева */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-full aspect-[4/3] overflow-hidden"
        >
          <img
            src="/aboutus.webp"
            alt="О нас"
            className="w-full h-full object-cover"
            onError={(e) => {
              const t = e.currentTarget
              if (t.src.includes('.webp')) t.src = '/aboutus.jpg'
              else if (t.src.includes('.jpg')) t.src = '/aboutus.png'
            }}
          />
        </motion.div>

        {/* Правая часть */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >

          {/* Блок с угловыми декорациями */}
          <div className="relative p-6">

            {/* Угол — левый верхний */}
            <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#1a1f4b]" />
            {/* Угол — правый нижний */}
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#1a1f4b]" />

            {/* Заголовок */}
            <AnimatePresence mode="wait">
              <motion.h3
                key={active + '-title'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl font-bold text-[#1a1f4b] leading-snug tracking-wide mb-4"
              >
                {tabs[active].title}
              </motion.h3>
            </AnimatePresence>

            {/* Текст */}
            <AnimatePresence mode="wait">
              <motion.p
                key={active + '-text'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-gray-600 text-base leading-relaxed"
              >
                {tabs[active].text}
              </motion.p>
            </AnimatePresence>

          </div>

          {/* Кнопки 1, 2, 3 */}
          <div className="grid grid-cols-3 gap-3 justify-items-center">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActive(i)}
                className={`relative flex items-center justify-center p-3 aspect-square w-full max-w-[140px] mx-auto overflow-hidden transition-all duration-300
                ${active === i
                  ? 'bg-[#1a1f4b] text-white'
                  : 'bg-[#f0f2ff] text-[#1a1f4b] hover:bg-[#d0d5f0]'
                }`}
              >
                <span className="text-sm font-semibold z-10 text-center">
                  {tab.label}
                </span>
                <span className={`absolute bottom-0 right-2 text-4xl font-bold leading-none select-none
                  ${active === i ? 'text-white opacity-20' : 'text-[#1a1f4b] opacity-10'}`}>
                  {tab.id}
                </span>
              </button>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}