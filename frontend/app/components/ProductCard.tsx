'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const PLACEHOLDER = '/placeholder.png'

interface ProductCardProps {
  slug: string
  title: string
  price?: number
  image?: string | null
  href?: string
  featured?: boolean
}

export default function ProductCard({
  slug,
  title,
  price = 0,
  image,
  href,
  featured = false,
}: ProductCardProps) {
  const linkHref = href ?? `/product/${slug}`

  const hasValidImage = Boolean(
    image &&
    typeof image === 'string' &&
    image.trim().length > 5 &&
    (image.startsWith('http') || image.startsWith('/'))
  )

  const [imgSrc, setImgSrc]   = useState(hasValidImage ? image! : PLACEHOLDER)
  const [imgError, setImgError] = useState(!hasValidImage)

  return (
    <Link
      href={linkHref}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#1a1f4b]/15"
    >
      {/* Изображение */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden">

        {/* Бейдж Хит */}
        {featured && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-yellow-400 text-[#1a1f4b] text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
            ХИТ
          </div>
        )}

        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-slate-300 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9H9"
              />
            </svg>
            <span className="text-xs text-slate-400">Фото скоро</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={`${title} — купить в SPORTCORE Бишкек`}
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              setImgSrc(PLACEHOLDER)
              setImgError(true)
            }}
          />
        )}

        {/* Hover-оверлей "Смотреть товар" */}
        <div className="absolute inset-x-0 bottom-0 bg-[#1a1f4b] text-white text-xs font-bold py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 tracking-wide">
          Смотреть товар →
        </div>
      </div>

      {/* Текст */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-semibold text-gray-800 group-hover:text-[#1a1f4b] transition-colors line-clamp-2 text-sm sm:text-[15px] leading-snug mb-2.5">
          {title}
        </h3>
        <p className="font-black text-[#1a1f4b] text-base sm:text-lg leading-none">
          {price.toLocaleString()}{' '}
          <span className="text-xs font-medium text-gray-400">сом</span>
        </p>
      </div>
    </Link>
  )
}
