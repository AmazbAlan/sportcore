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
          className="w-full aspect-[4/3] overflow-hidden rounded-sm"
        >
          <img
            src="/aboutus.webp"
            alt="О нас"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Попробуем другие расширения
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
          {/* Декоративный угол + заголовок */}
          <div className="relative pl-6 border-l-4 border-[#1a1f4b]">
            <AnimatePresence mode="wait">
              <motion.h3
                key={active + '-title'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl font-bold text-[#1a1f4b] leading-snug tracking-wide"
              >
                {tabs[active].title}
              </motion.h3>
            </AnimatePresence>
          </div>

          {/* Текст в рамке */}
          <div className="border border-dashed border-[#1a1f4b] border-opacity-30 rounded-sm p-5">
            <AnimatePresence mode="wait">
              <motion.p
                key={active + '-text'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600 text-base leading-relaxed"
              >
                {tabs[active].text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Кнопки 1, 2, 3 */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActive(i)}
                className={`relative flex flex-col items-start justify-end p-4 rounded-sm aspect-square transition-all duration-300 overflow-hidden
                  ${active === i
                    ? 'bg-[#1a1f4b] text-white'
                    : 'bg-[#f0f2ff] text-[#1a1f4b] hover:bg-[#1a1f4b] hover:text-white'
                  }`}
              >
                {/* Большая цифра */}
                <span className={`absolute top-2 right-3 text-5xl font-bold leading-none select-none transition-colors duration-300
                  ${active === i ? 'text-white opacity-20' : 'text-[#1a1f4b] opacity-10'}`}>
                  {tab.id}
                </span>
                <span className="relative z-10 text-sm font-semibold leading-tight">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}
