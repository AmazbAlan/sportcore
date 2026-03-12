import Image from 'next/image'
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[600px] text-white overflow-hidden">
      
      {/* Background image */}
      <Image
        src="/banner2.png"
        alt="Sportcore Banner"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay для читаемости */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1435]/80 via-[#1a1f4b]/60 to-transparent" />

      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        
        <h1 className="max-w-3xl text-4xl sm:text-5xl font-extrabold text-yellow-400 leading-tight drop-shadow-lg">
          SPORTCORE — магазин спортивных товаров
        </h1>

        <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/90 leading-relaxed">
          Всё для тренировок, спорта и активной жизни.  
          Качественное оборудование, аксессуары и экипировка.
        </p>

        {/* Кнопка */}
        <Link
          href="/category"
          className="
          mt-8
          bg-yellow-400
          text-[#1a1f4b]
          px-8
          py-4
          font-semibold
          rounded-lg
          shadow-lg
          transition-all
          duration-200
          hover:bg-yellow-300
          hover:shadow-xl
          hover:-translate-y-1
          active:scale-95
          active:shadow-md
          "
        >
          Перейти в каталог
        </Link>

      </div>
    </section>
  )
}