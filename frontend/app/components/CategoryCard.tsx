'use client'

import Link from 'next/link'
import { useState } from 'react'

interface CategoryCardProps {
  title: string
  image?: string | null
  href: string
  variant?: 'featured' | 'grid'
}

// Цвета и эмодзи для каждой категории по ключевым словам в названии
const CATEGORY_THEMES: Record<string, { bg: string; emoji: string }> = {
  'аксессуары':        { bg: 'from-violet-500 to-purple-700',  emoji: '🎽' },
  'единоборства':      { bg: 'from-red-500 to-rose-700',       emoji: '🥊' },
  'бокс':              { bg: 'from-red-500 to-rose-700',       emoji: '🥊' },
  'здоровье':          { bg: 'from-emerald-400 to-teal-600',   emoji: '💚' },
  'массаж':            { bg: 'from-emerald-400 to-teal-600',   emoji: '🧘' },
  'мячи':              { bg: 'from-orange-400 to-amber-600',   emoji: '⚽' },
  'игры':              { bg: 'from-orange-400 to-amber-600',   emoji: '🏀' },
  'плавание':          { bg: 'from-sky-400 to-blue-600',       emoji: '🏊' },
  'фитнес':            { bg: 'from-pink-400 to-fuchsia-600',   emoji: '🏋️' },
  'восстановление':    { bg: 'from-pink-400 to-fuchsia-600',   emoji: '🔄' },
  'футбол':            { bg: 'from-lime-400 to-green-600',     emoji: '⚽' },
  'баскетбол':         { bg: 'from-orange-500 to-red-600',     emoji: '🏀' },
  'волейбол':          { bg: 'from-yellow-400 to-orange-500',  emoji: '🏐' },
  'теннис':            { bg: 'from-yellow-300 to-lime-500',    emoji: '🎾' },
  'бег':               { bg: 'from-cyan-400 to-blue-500',      emoji: '🏃' },
  'обувь':             { bg: 'from-indigo-400 to-blue-600',    emoji: '👟' },
  'одежда':            { bg: 'from-purple-400 to-indigo-600',  emoji: '👕' },
  'питание':           { bg: 'from-green-400 to-emerald-600',  emoji: '🥗' },
  'велосипед':         { bg: 'from-teal-400 to-cyan-600',      emoji: '🚴' },
  'йога':              { bg: 'from-rose-300 to-pink-500',      emoji: '🧘' },
  'силовые':           { bg: 'from-gray-500 to-slate-700',     emoji: '💪' },
  'инвентарь':         { bg: 'from-slate-400 to-gray-600',     emoji: '🏆' },
}

function getTheme(name: string): { bg: string; emoji: string } {
  const lower = name.toLowerCase()
  for (const [key, theme] of Object.entries(CATEGORY_THEMES)) {
    if (lower.includes(key)) return theme
  }
  return { bg: 'from-slate-400 to-slate-600', emoji: '🏅' }
}

export default function CategoryCard({ title, image, href, variant = 'featured' }: CategoryCardProps) {
  const [imgError, setImgError] = useState(false)

  const hasValidImage = Boolean(
    image &&
    typeof image === 'string' &&
    image.trim().length > 5 &&
    image.startsWith('http')
  )

  const showImage = hasValidImage && !imgError
  const theme = getTheme(title)

  return (
    <Link
      href={href}
      className="group relative block w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]"
    >
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image!}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Красивая заглушка с градиентом и эмодзи */
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
          <span className="text-6xl select-none opacity-80 drop-shadow-lg">{theme.emoji}</span>
        </div>
      )}

      {/* Градиент поверх */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

      {/* Название */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="text-white text-sm font-semibold transition-all duration-300 group-hover:translate-y-[-2px] drop-shadow">
          {title}
        </span>
      </div>
    </Link>
  )
}