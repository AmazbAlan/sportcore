'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import CategoryCard from './CategoryCard'
import AnimatedCard from './AnimatedCard'

type Category = {
  name: string
  slug: string
  imageUrl: string
}

export default function CategoryGridClient({
  categories
}: {
  categories: Category[]
}) {
  const items = categories.slice(0, 5)

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#1a1f4b] tracking-tight">
          Популярные категории
        </h2>
        <Link href="/category" className="text-sm font-bold text-[#1a1f4b] hover:text-yellow-500 transition-colors flex items-center gap-1">
          Все категории
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* 📱 MOBILE */}
      <div className="block md:hidden">
        <Swiper spaceBetween={12} slidesPerView={1.3}>
          {items.map((cat) => (
            <SwiperSlide key={cat.slug}>
              <AnimatedCard>
                <CategoryCard
                  title={cat.name}
                  image={cat.imageUrl}
                  href={`/category/${cat.slug}`}
                />
              </AnimatedCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 💻 DESKTOP */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((cat, i) => (
          <AnimatedCard key={cat.slug} delay={i * 0.1}>
            <CategoryCard
              title={cat.name}
              image={cat.imageUrl}
              href={`/category/${cat.slug}`}
            />
          </AnimatedCard>
        ))}
      </div>

    </section>
  )
}