import Image from 'next/image'
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[600px] bg-[#1a1f4b] text-white overflow-hidden">
      <Image
        src="/banner2.png"
        alt="Sportcore Banner"
        fill
        className="object-cover opacity-60"
        priority
      />
      {/* Синий полупрозрачный оверлей */}
      <div className="absolute inset-0 bg-blue-500 mix-blend-overlay opacity-40 pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl sm:text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
          Добро пожаловать в SPORTCORE
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-white/100">
          Новая коллекция спортивных товаров 2025 уже в наличии!
        </p>
        <Link
          href="/category"
          className="mt-6 bg-yellow-400 text-[#1a1f4b] px-6 py-3 font-semibold rounded hover:bg-yellow-300 transition transform hover:scale-105"
        >
          Перейти в каталог
        </Link>
      </div>
    </section>
  )
}
