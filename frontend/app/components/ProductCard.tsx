'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const PLACEHOLDER = '/placeholder.jpg'

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

  const [imgSrc, setImgSrc] = useState(hasValidImage ? image! : PLACEHOLDER)
  const [imgError, setImgError] = useState(!hasValidImage)

  return (
    <Link
      href={linkHref}
      className="group block bg-white rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative w-full h-44 sm:h-52 mb-4">

        {/* Бейдж Хит — только если featured === true */}
        {featured && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-[#1a1f4b] text-xs font-semibold px-3 py-1 rounded-md shadow">
            Хит
          </div>
        )}

        {imgError ? (
          /* Заглушка когда нет фото */
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg">
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
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-contain p-2"
            loading="lazy"
            onError={() => {
              setImgSrc(PLACEHOLDER)
              setImgError(true)
            }}
          />
        )}
      </div>

      {/* Text */}
      <div className="px-4 pb-4 text-center">
        <h3 className="font-medium mb-2 text-[#1a1f4b] group-hover:text-black transition-colors line-clamp-2 text-sm sm:text-base">
          {title}
        </h3>
        <p className="font-bold text-[#1a1f4b] group-hover:text-black transition-colors text-base sm:text-lg">
          {price.toLocaleString()} сом
        </p>
      </div>
    </Link>
  )
}